import React, { useState, useEffect, useMemo } from 'react';
import { InputNumber, Select, Progress, message, Button } from 'antd';
import { useIntl, useModel } from 'umi';
import IconDown from '@/assets/images/down.svg';
import IconAdd from '@/assets/images/add.svg';
import { COLLATERAL_TOKENS, MINT_TOKENS, TokenPrices } from '@/config';
import { useERC20 } from '@/hooks/useContract';
import useTokenBalance, { useBep20Balance } from '@/hooks/useTokenBalance';
import { useWeb3React } from '@web3-react/core';
import { getBep20Contract } from '@/utils/contractHelper';
import { useCollateralSystem, usePrices } from '@/hooks/useContract';
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
import { toFixedWithoutRound, expandToNDecimals } from '@/utils/bigNumber';
import './index.less';
import useDataView from '@/hooks/useDataView';
import { useTokenPrice } from '@/hooks/useTokenPrice';
export default () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const provider = useProvider();
    const [collateralAmount, setCollateralAmount] = useState(0);
    const [lockedAmount, setLockedAmount] = useState<undefined | number>();
    const [toAmount, setToAmount] = useState<undefined | number>();
    // const [collateralBalance, setCollateralBalance] = useState('0.00');
    const [collateralToken, setCollateralToken] = useState();
    // const [fTokenBalance, setFTokenBalance] = useState('0.00')
    const [toToken, setToToken] = useState();
    const [submitting, setSubmitting] = useState(false);
    const [computedRatio, setComputedRatio] = useState(0);

    const collateralSystem = useCollateralSystem();

    const initialRatio = useInitialRatio(collateralToken);
    const collateralTokenPrice = useTokenPrice(collateralToken);

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

    const prices = usePrices();

    const { currencyRatio } = useDataView(collateralToken);

    const { handleApprove, requestedApproval } = useERC20Approve(
        collateralTokenAddress,
        collateralSytemContract,
        setLastUpdated,
    );

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

    const { balance } = useTokenBalance(
        Tokens.fToken.address[process.env.APP_CHAIN_ID!],
    );
    const fTokenBalance = balance?.toFixed(2);

    const { balance: collateralBalance } = useBep20Balance(collateralToken);

    // const fetchCollateralBalance = async () => {
    //     const token = collateralToken;
    //     if (!account) return;
    //     const tokenObj = Tokens[token];
    //     if (!token) return;
    //     const contract = useERC20(tokenObj.address[process.env.APP_CHAIN_ID]);
    //     const res = await contract.balanceOf(account);
    //     const amount = ethers.utils.formatUnits(res, tokenObj.decimals);
    //     console.log('fetchBEP20Balance: ', token, amount);
    //     const val = new BigNumber(amount).toFixed(2);
    //     setCollateralBalance(val);
    //     return val;
    // };

    // useEffect(() => {
    //     fetchCollateralBalance();
    // }, [collateralToken, account, provider]);

    // fToken价值/Collateral价值 最高不超过3/10
    const maxLockedAmount = useMemo(() => {
        if (collateralToken && collateralAmount) {
            const amount =
                (Number(collateralAmount) *
                    TokenPrices[collateralToken] *
                    0.3) /
                TokenPrices['fToken_USDT'];
            return amount;
        } else {
            return fTokenBalance;
        }
    }, [collateralAmount, collateralToken, fTokenBalance]);

    const getTokenPrice = async (token: string) => {
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
                const collateralPrice = await getTokenPrice(collateralToken);
                const collateralVal =
                    Number(collateralAmount) * collateralPrice;
                const fTokenVal = lockedAmount
                    ? Number(lockedAmount) * TokenPrices['fToken'] //TODO 平台币价格获取
                    : 0;
                const ratio = initialRatio * (1 - fTokenVal / collateralVal);
                const v = parseFloat(ratio.toFixed(2));
                console.log(v);
                computedRatio = v;
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
                const totalCollateral =
                    stakedData.startValue + collateralAmount * collateralPrice;
                const totalDebt = debtData.startValue + toAmount * 1; // TODO 目前铸造物只有FUSD
                const ratio =
                    totalDebt > 0
                        ? toFixedWithoutRound(
                              (totalCollateral * 100) / totalDebt,
                              2,
                          )
                        : 0;
                setfRatioData({
                    ...fRatioData,
                    startValue: currencyRatio * 100,
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
                const amount = toFixedWithoutRound(
                    (Number(collateralAmount) * price) / computedRatio,
                    2,
                );
                // TODO 铸造物的价格，FUSD是1，其它的从合约获取
                // const amount = toFixedWithoutRound(
                //     val / TokenPrices[toToken.substr(1)],
                //     2,
                // );
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
        if (toToken && toAmount) {
            const val =
                parseFloat(
                    new BigNumber(toAmount)
                        .multipliedBy(TokenPrices[toToken!]) //TODO 铸造物价格从合约获取
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
        setLockedData({
            ...lockedData,
            endValue: v || 0,
        });
    }, 500);

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

    const onSubmit = async () => {
        if (!account) {
            message.warning('Pls connect wallet first');
            return;
        }
        if (!collateralAmount || !toAmount) {
            message.warning('Collateral amount and to amount are required');
            return;
        }
        if (isApproved) {
            try {
                setSubmitting(true);
                const token = Tokens[collateralToken];
                const decimal = token.decimals;
                const tx = await collateralSystem.stakeAndBuild(
                    ethers.utils.formatBytes32String(collateralToken), // stakeCurrency
                    expandToNDecimals(collateralAmount!, decimal), // stakeAmount
                    expandToNDecimals(toAmount!, 18), // buildAmount
                );
                message.info(
                    'Mint tx sent out successfully. Pls wait for a while......',
                );
                const receipt = await tx.wait();
                console.log(receipt);
                setSubmitting(false);
                // fetchCollateralBalance();
                message.success('Mint successfully. Pls check your balance.');
            } catch (err) {
                setSubmitting(false);
                console.log(err);
            }
        }
    };

    return (
        <div className="mint-container">
            <DataView />
            <div className="mint-box">
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
                                className="custom-input"
                            />
                            <div className="token">
                                <Select
                                    value={collateralToken}
                                    onSelect={collateralTokenHandler}
                                    placeholder={'Select token'}
                                >
                                    {COLLATERAL_TOKENS.map((item) => (
                                        <Select.Option
                                            value={item.name}
                                            key={item.name}
                                        >
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <img src={IconAdd} alt="" className="icon-add" />

                <div className="input-item">
                    <p className="label">
                        {intl.formatMessage({ id: 'mint.locked' })}
                    </p>
                    <div className="input-item-content">
                        <div className="content-label">
                            <p className="left">FToken</p>
                            <p className="right">
                                Balance:{' '}
                                <span className="balance">{fTokenBalance}</span>
                            </p>
                        </div>
                        <div className="input">
                            <InputNumber
                                disabled // 暂不支持
                                value={lockedAmount}
                                onChange={lockedAmountHandler}
                                placeholder="0.00"
                                className="custom-input"
                            />
                            <div className="token">
                                <p>Max locked amount: {maxLockedAmount}</p>
                            </div>
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
                        </div>
                        <div className="input">
                            <InputNumber
                                value={toAmount}
                                placeholder="0.00"
                                className="custom-input"
                                onChange={toAmountHandler}
                            />
                            <div className="token">
                                <Select
                                    value={toToken}
                                    onSelect={toTokenHandler}
                                    placeholder={intl.formatMessage({
                                        id: 'mint.selectCasting',
                                    })}
                                >
                                    {MINT_TOKENS.map((item) => (
                                        <Select.Option value={item} key={item}>
                                            {item}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ratio">
                    <span>Ratio</span>
                    <Progress
                        percent={computedRatio * 10}
                        format={() =>
                            `${Number(computedRatio * 100).toFixed(2)}%`
                        }
                    />
                </div>

                {isApproved && (
                    <Button
                        className="btn-mint"
                        onClick={onSubmit}
                        loading={submitting}
                    >
                        {intl.formatMessage({ id: 'mint.mint' })}
                    </Button>
                )}
                {!isApproved && (
                    <Button
                        className="btn-mint"
                        onClick={handleApprove}
                        loading={requestedApproval}
                    >
                        Approve To Mint
                    </Button>
                )}
            </div>
        </div>
    );
};
