import React, { useState, useEffect, useMemo } from 'react';
import { InputNumber, Select, Progress, Button, Popover } from 'antd';
import * as message from '@/components/Notification';
import { useIntl, useModel } from 'umi';
import IconDown from '@/assets/images/down.svg';
import IconAdd from '@/assets/images/add.svg';
import { COLLATERAL_TOKENS, MINT_TOKENS } from '@/config';
import { useERC20 } from '@/hooks/useContract';
import useTokenBalance, { useBep20Balance } from '@/hooks/useTokenBalance';
import { useWeb3React } from '@web3-react/core';
import { getBep20Contract } from '@/utils/contractHelper';
import {
    useCollateralSystem,
    usePrices,
    useExchangeSystem,
    useConfig,
} from '@/hooks/useContract';
import Tokens from '@/config/constants/tokens';
import Contracts from '@/config/constants/contracts';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import DataView from './DataView';
import { debounce } from 'lodash';
import {
    useCheckERC20ApprovalStatus,
    useERC20Approve,
} from '@/hooks/useApprove';
import { useInitialRatio } from '@/hooks/useConfig';
import useProvider from '@/hooks/useWeb3Provider';
import {
    toFixedWithoutRound,
    expandToNDecimals,
    expandTo18Decimals,
} from '@/utils/bigNumber';
import './index.less';
import useDataView from '@/hooks/useDataView';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import Scale from '@/components/Scale';
// import SettingView from './SettingView';
import classNames from 'classnames';
import useDexPrice from '@/hooks/useDexPrice';
import SelectTokens from '@/components/SelectTokens';
import CommentaryCard from '@/components/CommentaryCard';
import { useCallback } from 'react';
import { isDeliveryAsset } from '@/utils';
// import Popover from '@/components/Popover';
import { TokenIcon } from '@/components/Icon';
import TransitionConfirm from '@iron/TransitionConfirm';
import { StatusType } from '@/components/ProgressBar';

export default () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const provider = useProvider();
    const [collateralAmount, setCollateralAmount] = useState(0);
    const [lockedAmount, setLockedAmount] = useState<undefined | number>(0);
    const [toAmount, setToAmount] = useState<undefined | number>();
    // const [collateralBalance, setCollateralBalance] = useState('0.00');
    const [collateralToken, setCollateralToken] = useState(
        COLLATERAL_TOKENS[0].name,
    );
    // const [fTokenBalance, setFTokenBalance] = useState('0.00')
    const [toToken, setToToken] = useState(MINT_TOKENS[0]);
    const [submitting, setSubmitting] = useState(false);
    const [computedRatio, setComputedRatio] = useState(0);
    const [lockedScale, setLockedScale] = useState<string | number>('0');

    const [showSelectFromToken, setShowSelectFromToken] = useState(false);
    const [showSelectToToken, setShowSelectToToken] = useState(false);

    const collateralSystem = useCollateralSystem();
    const exchangeSystem = useExchangeSystem();
    const configContract = useConfig();

    const initialRatio = useInitialRatio(collateralToken);

    const IFTPrice = useDexPrice('IFT', 'USDC');

    const collateralTokenAddress = useMemo(() => {
        if (collateralToken) {
            return Tokens[collateralToken].address[process.env.APP_CHAIN_ID!];
        }
        return '';
    }, [collateralToken]);
    const collateralSytemContract =
        Contracts.CollateralSystem[process.env.APP_CHAIN_ID!];
    const { isApproved, setLastUpdated } = useCheckERC20ApprovalStatus(
        collateralTokenAddress,
        collateralSytemContract,
    );

    const { isApproved: isIFTApproved, setLastUpdated: setLastIFTApproved } =
        useCheckERC20ApprovalStatus(
            Tokens.IFT.address[process.env.APP_CHAIN_ID],
            collateralSytemContract,
        );

    const prices = usePrices();

    const { currencyRatio } = useDataView(collateralToken);

    const { handleApprove, requestedApproval } = useERC20Approve(
        collateralTokenAddress,
        collateralSytemContract,
        setLastUpdated,
    );

    const {
        handleApprove: handleIFTApprove,
        requestedApproval: requestIFTApproval,
    } = useERC20Approve(
        Tokens.IFT.address[process.env.APP_CHAIN_ID],
        collateralSytemContract,
        setLastIFTApproved,
    );

    const handleAllApprove = () => {
        if (!isApproved && collateralToken) {
            handleApprove();
            return; // 一次按钮点击处理一次approve
        }
        if (!isIFTApproved) {
            handleIFTApprove();
            return;
        }
    };

    // const { stakedData, setStakedData } = useStakedData();

    const {
        stakedData,
        setStakedData,
        lockedData,
        setLockedData,
        debtData,
        setDebtData,
        fRatioData,
        setfRatioData,
    } = useModel('dataView', (model) => ({
        ...model,
    }));

    const { balance, refresh: refreshIFTBalance } = useBep20Balance('IFT');
    const fTokenBalance = balance as number;

    const { balance: collateralBalance, refresh: refreshCollateralBalance } =
        useBep20Balance(collateralToken);

    const { balance: mintBalance, refresh: refreshMintBalance } =
        useBep20Balance(toToken);

    const refreshBalance = () => {
        refreshIFTBalance();
        refreshCollateralBalance();
        refreshMintBalance();
    };
    // TODO fToken价值/Collateral价值 最高不超过3/10
    // const maxLockedAmount = useMemo(() => {
    //     if (collateralToken && collateralAmount) {
    //         const amount =
    //             (Number(collateralAmount) *
    //                 TokenPrices[collateralToken] *
    //                 0.3) /
    //             TokenPrices['fToken_USDT'];
    //         return amount;
    //     } else {
    //         return fTokenBalance;
    //     }
    // }, [collateralAmount, collateralToken, fTokenBalance]);

    const getTokenPrice = async (token: string) => {
        if (!token) return 0;
        const res = await prices.getPrice(
            ethers.utils.formatBytes32String(token),
        );
        return parseFloat(ethers.utils.formatEther(res));
    };

    // 实时计算的ratio。用来判断能否mint和计算能mint多少toToken
    useEffect(() => {
        (async () => {
            let computedRatio;
            if (!collateralAmount || !collateralToken || !lockedAmount) {
                computedRatio = initialRatio;
            } else if (!lockedAmount || Number(lockedAmount) === 0) {
                computedRatio = initialRatio;
            } else {
                const [
                    catalystEffectContract,
                    proportionContract,
                    priceContract,
                ] = await collateralSystem.getCatalystResult(
                    ethers.utils.formatBytes32String(collateralToken), // stake currency
                    expandTo18Decimals(collateralAmount), //stake amount
                    expandTo18Decimals(lockedAmount), // locked amount
                );
                console.log(
                    'getCatalystResult: ',
                    ethers.utils.formatEther(catalystEffectContract),
                    ethers.utils.formatEther(proportionContract),
                    ethers.utils.formatEther(priceContract),
                );
                // 合约计算的是利用率增加了catalystEffectContract
                const catalystEffect = parseFloat(
                    ethers.utils.formatEther(catalystEffectContract),
                );
                const newURatio = (1 / initialRatio) * (1 + catalystEffect);
                computedRatio = 1 / newURatio;
            }
            setComputedRatio(computedRatio);
        })();
    }, [collateralAmount, collateralToken, lockedAmount, initialRatio]);

    useEffect(() => {
        console.log('initialRatio ', initialRatio);
    }, [initialRatio]);

    useEffect(() => {
        (async () => {
            if (collateralAmount && toAmount && collateralToken && toToken) {
                const collateralPrice = await getTokenPrice(collateralToken);
                const toTokenPrice = await getTokenPrice(toToken);
                const totalCollateral =
                    stakedData.startValue + collateralAmount * collateralPrice;
                const totalDebt = debtData.startValue + toAmount * toTokenPrice;
                const ratio =
                    totalDebt > 0
                        ? toFixedWithoutRound(
                              (totalCollateral * 100) / totalDebt,
                              2,
                          )
                        : 0;
                setfRatioData({
                    ...fRatioData,
                    startValue: parseFloat((currencyRatio * 100).toFixed(2)),
                    endValue: Number(ratio),
                });
            }
        })();
    }, [collateralAmount, toAmount, collateralToken, toToken]);

    // 计算toAmount
    useEffect(() => {
        (async () => {
            if (computedRatio >= 2 && toToken && collateralAmount) {
                const price = await getTokenPrice(collateralToken);
                const fusdAmount = toFixedWithoutRound(
                    (Number(collateralAmount) * price) / computedRatio,
                    2,
                );
                // TODO 铸造物的价格，FUSD是1，其它的从合约获取
                const toTokenPrice = await getTokenPrice(toToken);
                const amount = toFixedWithoutRound(
                    parseFloat(fusdAmount) / toTokenPrice,
                    2,
                );
                setToAmount(parseFloat(amount));
            } else {
                setToAmount(0);
            }
        })();
    }, [
        collateralToken,
        collateralAmount,
        lockedAmount,
        computedRatio,
        toToken,
    ]);

    // 计算新的债务
    useEffect(() => {
        (async () => {
            if (toToken && toAmount) {
                const toTokenPrice = await getTokenPrice(toToken);
                const val =
                    parseFloat(
                        new BigNumber(toAmount)
                            .multipliedBy(toTokenPrice)
                            .toFixed(2),
                    ) + debtData.startValue;
                setDebtData({
                    ...debtData,
                    endValue: val,
                });
            } else {
                setDebtData({
                    ...debtData,
                    endValue: debtData.startValue,
                });
            }
        })();
    }, [toToken, toAmount]);
    const collateralAmountHandler = debounce(async (v) => {
        setCollateralAmount(v);
        const price = await getTokenPrice(collateralToken);
        const currentStakeValue = Number(v) * price + stakedData.startValue;
        setStakedData({
            ...stakedData,
            endValue: currentStakeValue,
        });
    }, 500);

    const lockedAmountHandler = debounce((v) => {
        // TODO comment this for test
        // if (Number(v) > maxLockedAmount) {
        //     setLockedAmount(0);
        //     message.warning('锁仓价值不能超过质押价值的3/10');
        //     return;
        // }
        setLockedAmount(v);
        setLockedScale(Number(v) / fTokenBalance);
        const val = parseFloat(toFixedWithoutRound(IFTPrice * v, 2));
        setLockedData({
            ...lockedData,
            endValue: val || 0,
        });
    }, 500);

    const scaleHandler = (v) => {
        setLockedScale(v);
        const amount = fTokenBalance * Number(v);
        setLockedAmount(amount);
        const val = parseFloat(toFixedWithoutRound(IFTPrice * amount, 2));
        setLockedData({
            ...lockedData,
            endValue: val || 0,
        });
    };

    const toAmountHandler = (v) => {
        setToAmount(v);
    };

    const collateralTokenHandler = (v) => {
        setCollateralToken(v);
        setCollateralAmount(0);
        setToAmount(0);
    };

    const toTokenHandler = (v) => {
        setToToken(v);
        setToAmount(0);
    };

    const [showTxConfirm, setShowTxConfirm] = useState(false);
    const [tx, setTx] = useState<any | null>(null);

    const onSubmit = async () => {
        if (!account) {
            message.warning('Pls connect wallet first');
            return;
        }
        if (!collateralAmount || !toAmount) {
            message.warning('Collateral amount and to amount are required');
            return;
        }
        if (isApproved && isIFTApproved) {
            setShowTxConfirm(true);
            setTx({
                collateral: {
                    token: collateralToken,
                    amount: collateralAmount,
                    price: '--',
                },
                minted: {
                    token: toToken,
                    amount: toAmount,
                    price: '--',
                },
                locked: {
                    token: 'FToken',
                    amount: lockedAmount,
                    price: '--',
                },
                type: isDeliveryAsset(toToken) ? 'Delivery' : 'Perpetuation',
            });

            try {
                setSubmitting(true);
                //TODO 目前仅支持mint fusd。其它合成资产需要调用mint和trade两步操作。后续优化成一步操作。
                if (isDeliveryAsset(toToken)) {
                    const tokenPrice = await getTokenPrice(toToken);
                    const fusdAmount = toAmount * tokenPrice; // fusd price is 1
                    const tx1 = await collateralSystem.stakeAndBuild(
                        ethers.utils.formatBytes32String(collateralToken), // stakeCurrency
                        expandTo18Decimals(collateralAmount), // stakeAmount
                        expandTo18Decimals(fusdAmount), // buildAmount
                        expandTo18Decimals(lockedAmount || 0),
                    );
                    const receipt1 = await tx1.wait();
                    console.log(receipt1);
                    const tx2 = await exchangeSystem.exchange(
                        ethers.utils.formatBytes32String('FUSD'), // sourceKey
                        expandTo18Decimals(fusdAmount), // sourceAmount
                        account, // destAddr
                        ethers.utils.formatBytes32String(toToken), // destKey
                    );
                    const receipt2 = await tx2.wait();
                    console.log(receipt2);
                    await handleTxReceipt(receipt2);
                    refreshBalance();
                    setSubmitting(false);
                    // fetchCollateralBalance();
                    message.success(
                        'Mint successfully. Pls check your balance.',
                    );
                } else {
                    const token = Tokens[collateralToken];
                    const decimal = token.decimals;
                    const tx0 = await collateralSystem.stakeAndBuild(
                        ethers.utils.formatBytes32String(collateralToken), // stakeCurrency
                        expandToNDecimals(collateralAmount!, decimal), // stakeAmount
                        expandToNDecimals(toAmount!, 18), // buildAmount
                        expandTo18Decimals(lockedAmount || 0),
                    );
                    message.info(
                        'Mint tx0 sent out successfully. Pls wait for a while......',
                    );
                    const receipt = await tx0.wait();
                    console.log(receipt);
                    setSubmitting(false);
                    // fetchCollateralBalance();
                    message.success(
                        'Mint successfully. Pls check your balance.',
                    );
                    refreshBalance();
                }
            } catch (err) {
                setSubmitting(false);
                console.log(err);
            } finally {
                setShowTxConfirm(false);
            }
        }
    };

    // *****TODO to be removed starts *********
    const getTradeSettlementDelay = async () => {
        const res = await configContract.getUint(
            ethers.utils.formatBytes32String('TradeSettlementDelay'),
        );
        console.log('getTradeSettlementDelay', res.toNumber());
    };
    const getRevertDelay = async () => {
        const res = await configContract.getUint(
            ethers.utils.formatBytes32String('TradeRevertDelay'),
        );
        console.log('getRevertDelay', res.toNumber());
    };
    const settleTrade = async (entryId: number) => {
        const res = await exchangeSystem.settle(entryId);
        console.log(res);
    };

    // 超时的只能revert
    const revertTrade = async (entryId: number) => {
        const res = await exchangeSystem.revertPendingExchange(entryId);
        console.log(res);
    };
    const handleTxReceipt = (receipt) => {
        getTradeSettlementDelay();
        getRevertDelay();
        const exchangeContract =
            Contracts.ExchangeSystem[process.env.APP_CHAIN_ID];
        for (const event of receipt.events) {
            if (event.address === exchangeContract) {
                const lastEntryId = event.args[0].toNumber();
                console.log('>>> lastEntryId <<<', lastEntryId);
                setTimeout(async () => {
                    try {
                        await settleTrade(lastEntryId);
                        message.success(
                            'Trade has been settled.Pls check your balance',
                        );
                    } catch (err) {
                        setTimeout(async () => {
                            await revertTrade(lastEntryId);
                            message.error(
                                'Trade has been reverted. Pls try again.',
                            );
                        }, 60000);
                        console.log(err);
                    }
                }, 6000); // 合约目前设置的delay是6秒,revert delay 是1min。
            }
        }
    };

    // *****TODO to be removed ends *********

    return (
        <div className="mint-container">
            <DataView />
            <div className="right-box">
                <CommentaryCard
                    title="Begin To Mint"
                    description={
                        'Mint fUSD by staking your Token. Token stakers earn weekly staking rewards .'
                    }
                />
                <div className="mint-box common-box">
                    <div className="input-item">
                        <p className="label">
                            {intl.formatMessage({ id: 'mint.from' })}
                        </p>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left">
                                    {intl.formatMessage({ id: 'collateral' })}
                                </p>
                                <p className="right">
                                    Balance:{' '}
                                    <span className="balance">
                                        {collateralBalance}
                                    </span>
                                </p>
                            </div>
                            <div className="input">
                                <InputNumber
                                    value={collateralAmount}
                                    onChange={collateralAmountHandler}
                                    placeholder="0.00"
                                    className={classNames({
                                        'custom-input': true,
                                        disabled: !isApproved,
                                    })}
                                />
                                <div className="token">
                                    <TokenIcon
                                        name={collateralToken.toLowerCase()}
                                        size={24}
                                    />
                                    <SelectTokens
                                        visable={showSelectFromToken}
                                        value={collateralToken}
                                        tokenList={COLLATERAL_TOKENS}
                                        onSelect={collateralTokenHandler}
                                        onClose={() => {
                                            setShowSelectFromToken(false);
                                        }}
                                    >
                                        <button
                                            className="btn-mint-form"
                                            onClick={() => {
                                                setShowSelectFromToken(true);
                                            }}
                                        >
                                            <span>
                                                {collateralToken || (
                                                    <span>Select token</span>
                                                )}
                                            </span>
                                            <i className="icon-down size-20"></i>
                                        </button>
                                    </SelectTokens>
                                </div>
                            </div>
                        </div>
                    </div>

                    <img src={IconAdd} alt="" className="icon-add" />

                    <div className="input-item">
                        <div className="label">
                            {intl.formatMessage({ id: 'mint.locked' })}
                            <Popover
                                content={'这是一段文字这是一段文字这是一段文字'}
                                trigger="hover"
                                placement="topLeft"
                            >
                                <i className="icon-question size-16"></i>
                            </Popover>
                        </div>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left">FToken</p>
                                <p className="right">
                                    Balance:{' '}
                                    <span className="balance">
                                        {fTokenBalance}
                                    </span>
                                </p>
                            </div>
                            <div className="input">
                                <InputNumber
                                    value={lockedAmount}
                                    onChange={lockedAmountHandler}
                                    placeholder="0.00"
                                    className="custom-input"
                                />
                                <Scale.Group
                                    value={lockedScale}
                                    updateScale={scaleHandler}
                                >
                                    {[
                                        { label: '0', value: 0 },
                                        { label: '1/10', value: 0.1 },
                                        { label: '1/5', value: 0.2 },
                                        { label: '3/10', value: 0.3 },
                                    ].map((option) => (
                                        <Scale.Option
                                            key={option.label}
                                            value={option.value}
                                        >
                                            <span>{option.label}</span>
                                        </Scale.Option>
                                    ))}
                                </Scale.Group>
                            </div>
                        </div>
                    </div>

                    <div className="input-item">
                        <p className="label">
                            {intl.formatMessage({ id: 'mint.to' })}
                        </p>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left">
                                    {intl.formatMessage({ id: 'mint.mint' })}
                                </p>
                                <p className="right">
                                    {intl.formatMessage({ id: 'mint.balance' })}
                                    <span className="balance">
                                        {mintBalance}
                                    </span>
                                </p>
                            </div>
                            <div className="input">
                                <InputNumber
                                    value={toAmount}
                                    placeholder="0.00"
                                    className={classNames({
                                        'custom-input': true,
                                        disabled: !isApproved,
                                    })}
                                    onChange={toAmountHandler}
                                />
                                <div className="token">
                                    <TokenIcon
                                        name={String(toToken).toLowerCase()}
                                        size={24}
                                    />
                                    <SelectTokens
                                        visable={showSelectToToken}
                                        value={toToken}
                                        tokenList={MINT_TOKENS.map((name) => ({
                                            name,
                                        }))}
                                        onSelect={toTokenHandler}
                                        onClose={() => {
                                            setShowSelectToToken(false);
                                        }}
                                    >
                                        <button
                                            className="btn-mint-form"
                                            onClick={() => {
                                                setShowSelectToToken(true);
                                            }}
                                        >
                                            <span>
                                                {toToken || (
                                                    <span>
                                                        {intl.formatMessage({
                                                            id: 'mint.selectCasting',
                                                        })}
                                                    </span>
                                                )}
                                            </span>
                                            <i className="icon-down size-20"></i>
                                        </button>
                                    </SelectTokens>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isApproved && isIFTApproved && (
                        <div className="ratio">
                            <Progress
                                className="iron-progress"
                                percent={computedRatio * 10}
                                format={() =>
                                    `${toFixedWithoutRound(
                                        computedRatio * 100,
                                        2,
                                    )}%`
                                }
                            />
                        </div>
                    )}

                    {isApproved && isIFTApproved && (
                        <Button
                            className="btn-mint common-btn common-btn-red"
                            onClick={onSubmit}
                            loading={submitting}
                        >
                            {intl.formatMessage({ id: 'mint.mint' })}
                        </Button>
                    )}
                    {((!isApproved && collateralToken) || !isIFTApproved) && (
                        <Button
                            className="btn-mint common-btn common-btn-red"
                            onClick={handleAllApprove}
                            loading={requestedApproval || requestIFTApproval}
                        >
                            Approve To Mint
                        </Button>
                    )}
                </div>
            </div>
            <TransitionConfirm
                visable={showTxConfirm}
                onClose={() => setShowTxConfirm(false)}
                dataSource={
                    tx
                        ? [
                              {
                                  label: 'Collateral',
                                  value: {
                                      token: tx.collateral.token,
                                      amount: tx.collateral.amount,
                                      mappingPrice: tx.collateral.price,
                                  },
                              },
                              {
                                  label: 'Minted',
                                  value: {
                                      token: tx.minted.token,
                                      amount: tx.minted.amount,
                                      mappingPrice: tx.minted.price,
                                  },
                              },
                              {
                                  label: 'Locked',
                                  value: {
                                      token: tx.locked.token,
                                      amount: tx.locked.amount,
                                      mappingPrice: tx.locked.price,
                                  },
                              },
                              { label: 'Type', value: tx.type },
                          ]
                        : []
                }
            />
        </div>
    );
};
