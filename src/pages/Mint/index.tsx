import './less/index.less';

import React, { useState, useEffect, useMemo } from 'react';
import { InputNumber, Select, Progress, Button, Popover } from 'antd';
import * as message from '@/components/Notification';
import { request, useIntl, useModel } from 'umi';
import IconDown from '@/assets/images/down.svg';
import IconAdd from '@/assets/images/add.svg';
import { COLLATERAL_TOKENS, MINT_TOKENS, PLATFORM_TOKEN } from '@/config';
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
import DataView from './components/DataView';
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
import useDataView from '@/hooks/useDataView';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import Scale from '@/components/Scale';
// import SettingView from './SettingView';
import classNames from 'classnames';
import SelectTokens from '@/components/SelectTokens';
import CommentaryCard from '@/components/CommentaryCard';
import { useCallback } from 'react';
import { isDeliveryAsset } from '@/utils';
// import Popover from '@/components/Popover';
import { TokenIcon } from '@/components/Icon';
import TransitionConfirm from '@iron/TransitionConfirm';
import { StatusType } from '@/components/ProgressBar';
import { getTokenPrice } from '@/utils';
import useEnv from '@/hooks/useEnv';

export default () => {
    const intl = useIntl();
    const isMobile = useEnv();
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

    const { requestConnectWallet } = useModel('app', (model) => ({
        requestConnectWallet: model.requestConnectWallet,
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

    // 实时计算的ratio。用来判断能否mint和计算能mint多少toToken
    useEffect(() => {
        (async () => {
            let newRatio = currencyRatio;
            if (
                account &&
                collateralToken &&
                collateralAmount &&
                lockedAmount
            ) {
                const _buildRatio = await collateralSystem.calcBuildRatio(
                    account,
                    ethers.utils.formatBytes32String(collateralToken), // stake currency
                    expandTo18Decimals(collateralAmount), //stake amount
                    expandTo18Decimals(lockedAmount), // locked amount
                );
                const buildRatio = parseFloat(
                    ethers.utils.formatEther(_buildRatio),
                );

                console.log('calcBuildRatio: ', buildRatio);
                newRatio = 1 / buildRatio;
                setfRatioData({
                    ...fRatioData,
                    endValue: parseFloat((newRatio * 100).toFixed(2)),
                });
            }
            setComputedRatio(newRatio);
        })();
    }, [collateralAmount, collateralToken, lockedAmount, account]);

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
                    fusdAmount / toTokenPrice,
                    2,
                );
                setToAmount(amount);
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
                const val = parseFloat(
                    new BigNumber(toAmount)
                        .multipliedBy(toTokenPrice)
                        .plus(debtData.startValue)
                        .toFixed(2),
                );
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
    const collateralAmountHandler = React.useCallback(
        debounce(async (v) => {
            setCollateralAmount(v);
            const price = await getTokenPrice(collateralToken);
            const currentStakeValue = Number(v) * price + stakedData.startValue;
            setStakedData({
                ...stakedData,
                endValue: currentStakeValue,
            });
        }, 500),
        [stakedData],
    );

    const lockedAmountHandler = React.useCallback(
        debounce(async (v) => {
            // TODO comment this for test
            // if (Number(v) > maxLockedAmount) {
            //     setLockedAmount(0);
            //     message.warning('锁仓价值不能超过质押价值的3/10');
            //     return;
            // }
            setLockedAmount(v);
            setLockedScale(Number(v) / fTokenBalance);
            const bsPrice = await getTokenPrice(PLATFORM_TOKEN);
            const val = toFixedWithoutRound(bsPrice * v, 2);
            setLockedData({
                ...lockedData,
                endValue: val + lockedData.startValue,
            });
        }, 500),
        [fTokenBalance, lockedData],
    );

    const scaleHandler = async (v) => {
        setLockedScale(v);
        const amount = fTokenBalance * Number(v);
        setLockedAmount(amount);
        const bsPrice = await getTokenPrice(PLATFORM_TOKEN);
        const val = toFixedWithoutRound(bsPrice * amount, 2);
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
            const collateralTokenPrice = await getTokenPrice(collateralToken);
            const toTokenPrice = await getTokenPrice(toToken);
            const lockedPrice = await getTokenPrice(PLATFORM_TOKEN); // TODO change name
            setTx({
                collateral: {
                    token: collateralToken,
                    amount: collateralAmount,
                    price: (collateralAmount * collateralTokenPrice).toFixed(2),
                },
                minted: {
                    token: toToken,
                    amount: toAmount,
                    price: (toTokenPrice * toAmount).toFixed(2),
                },
                locked: {
                    token: 'BS',
                    amount: lockedAmount,
                    price: (lockedPrice * lockedAmount).toFixed(2),
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
                    const tx0 = await collateralSystem.stakeAndBuild(
                        ethers.utils.formatBytes32String(collateralToken), // stakeCurrency
                        expandTo18Decimals(collateralAmount!), // stakeAmount
                        expandTo18Decimals(toAmount!), // buildAmount
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
            {!isMobile && <DataView />}
            <div className="right-box">
                {!isMobile && (
                    <CommentaryCard
                        title={intl.formatMessage({ id: 'mint.title' })}
                        description={intl.formatMessage({ id: 'mint.desc' })}
                    />
                )}
                <div className="mint-form-box common-box">
                    <div className="input-item">
                        <p className="label">
                            {intl.formatMessage({ id: 'mint.from' })}
                        </p>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left">
                                    {intl.formatMessage({
                                        id: 'mint.collateral',
                                    })}
                                </p>
                                <p className="right">
                                    {intl.formatMessage({ id: 'balance:' })}{' '}
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
                                        value={collateralToken}
                                        tokenList={COLLATERAL_TOKENS}
                                        onSelect={collateralTokenHandler}
                                    ></SelectTokens>
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
                                <i className="icon-question size-24"></i>
                            </Popover>
                        </div>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left">
                                    <TokenIcon
                                        name="bs"
                                        style={{ marginRight: 6 }}
                                    />
                                    {intl.formatMessage({ id: 'mint.ftoken' })}
                                </p>
                                <p className="right">
                                    {intl.formatMessage({ id: 'balance:' })}
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
                                    {intl.formatMessage({ id: 'mint.fassets' })}
                                </p>
                                <p className="right">
                                    {intl.formatMessage({ id: 'balance:' })}
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
                                        value={toToken}
                                        tokenList={MINT_TOKENS.map((name) => ({
                                            name,
                                        }))}
                                        onSelect={toTokenHandler}
                                        placeholder={intl.formatMessage({
                                            id: 'mint.selectCasting',
                                        })}
                                    ></SelectTokens>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isApproved && isIFTApproved && isMobile && (
                        <div className="ratio">
                            <Progress
                                className="iron-progress"
                                percent={computedRatio * 10}
                                format={() => (
                                    <div className="stake-ratio">
                                        <span className="final">
                                            {toFixedWithoutRound(
                                                computedRatio * 100,
                                                2,
                                            )}
                                            %
                                        </span>
                                        <i className="icon-arrow-white size-22" />
                                        <span className="initial">500%</span>
                                    </div>
                                )}
                            />
                        </div>
                    )}
                    {isApproved && isIFTApproved && !isMobile && (
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
                    {!account && (
                        <Button
                            className="btn-mint common-btn common-btn-yellow"
                            onClick={() => {
                                requestConnectWallet();
                            }}
                        >
                            {intl.formatMessage({ id: 'app.unlockWallet' })}
                        </Button>
                    )}
                    {isApproved && isIFTApproved && (
                        <Button
                            className="btn-mint common-btn common-btn-red"
                            onClick={onSubmit}
                            loading={submitting}
                        >
                            {intl.formatMessage({ id: 'mint.cast' })}
                        </Button>
                    )}
                    {account &&
                        ((!isApproved && collateralToken) ||
                            !isIFTApproved) && (
                            <Button
                                className="btn-mint common-btn common-btn-red"
                                onClick={handleAllApprove}
                                loading={
                                    requestedApproval || requestIFTApproval
                                }
                            >
                                {intl.formatMessage({ id: 'mint.approve' })}
                            </Button>
                        )}
                    {isMobile && <span className="fee-cost">Fee cost: 0</span>}
                </div>
            </div>
            {isMobile && <DataView />}
            <TransitionConfirm
                visable={showTxConfirm}
                onClose={() => setShowTxConfirm(false)}
                dataSource={
                    tx && [
                        {
                            label: 'Collateral',
                            direct: 'from',
                            value: {
                                token: tx.collateral.token,
                                amount: tx.collateral.amount,
                                mappingPrice: tx.collateral.price,
                            },
                        },
                        {
                            label: 'Minted',
                            direct: 'to',
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
                }
            />
        </div>
    );
};
