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
import { useCollateralSystem } from '@/hooks/useContract';
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
import useProvider from '@/hooks/useWeb3Provider';
import { toFixedWithoutRound, expandToNDecimals } from '@/utils/bigNumber';
import './index.less';
export default () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const provider = useProvider();
    const [collateralAmount, setCollateralAmount] = useState();
    const [lockedAmount, setLockedAmount] = useState<undefined | number>();
    const [toAmount, setToAmount] = useState<undefined | number>();
    // const [collateralBalance, setCollateralBalance] = useState('0.00');
    const [collateralToken, setCollateralToken] = useState('BTC');
    // const [fTokenBalance, setFTokenBalance] = useState('0.00')
    const [toToken, setToToken] = useState();
    const [submitting, setSubmitting] = useState(false);

    const collateralSystem = useCollateralSystem();

    const btcAddress = Tokens['BTC'].address[process.env.APP_CHAIN_ID!];

    const collateralTokenAddress = useMemo(() => {
        return Tokens[collateralToken].address[process.env.APP_CHAIN_ID!];
    }, [collateralToken]);
    const collateralSytemContract =
        Contracts.CollateralSystem[process.env.APP_CHAIN_ID!];
    const { isApproved, setLastUpdated } = useCheckERC20ApprovalStatus(
        collateralTokenAddress,
        collateralSytemContract,
    );

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
        setfRadioData,
    } = useModel('dataView', (model) => ({
        ...model,
    }));

    const { balance } = useTokenBalance(
        Tokens.fToken.address[process.env.APP_CHAIN_ID!],
    );
    const fTokenBalance = balance.toFixed(2);

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

    const ratio = useMemo(() => {
        const initRatio =
            COLLATERAL_TOKENS.find((item) => item.name === collateralToken)!
                .ratio * 10; //  进度条满是100
        if (!collateralAmount || !collateralToken || !lockedAmount) {
            return initRatio;
        } else if (!lockedAmount || Number(lockedAmount) === 0) {
            // 单币质押
            return initRatio;
        } else {
            const collateralVal =
                Number(collateralAmount) * TokenPrices[collateralToken];
            const fTokenVal = lockedAmount
                ? Number(lockedAmount) * TokenPrices['fToken']
                : 0;
            const ratio = initRatio * (1 - fTokenVal / collateralVal);
            const v = parseFloat(ratio.toFixed(2));
            console.log(v);
            return v;
        }
    }, [collateralAmount, collateralToken, lockedAmount]);

    useEffect(() => {
        const initRatio =
            COLLATERAL_TOKENS.find((item) => item.name === collateralToken)!
                .ratio * 100; //  进度条满是100
        setfRadioData({
            ...fRatioData,
            startValue: initRatio,
            endValue: ratio,
        });
    }, [collateralToken]);
    useEffect(() => {
        setfRadioData({
            ...fRatioData,
            endValue: parseFloat(Number(ratio * 10).toFixed(2)),
        });
    }, [ratio]);

    // 计算toAmount
    useEffect(() => {
        if (ratio >= 20 && toToken && collateralAmount) {
            const val =
                (Number(collateralAmount) * TokenPrices[collateralToken]) /
                (ratio / 10);
            const amount = toFixedWithoutRound(
                val / TokenPrices[toToken.substr(1)],
                2,
            );
            setToAmount(parseFloat(amount));
        } else {
            setToAmount(0);
        }
    }, [collateralToken, collateralAmount, lockedAmount, ratio, toToken]);

    // 计算新的债务
    useEffect(() => {
        if (toToken && toAmount) {
            const val =
                parseFloat(
                    new BigNumber(toAmount)
                        .multipliedBy(TokenPrices[toToken!])
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
    const collateralAmountHandler = debounce((v) => {
        setCollateralAmount(v);
        const currentStakeValue =
            Number(v) * TokenPrices[collateralToken] + stakedData.startValue;
        setStakedData({
            ...stakedData,
            endValue: currentStakeValue || 0,
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
                                    onSelect={(v) => setCollateralToken(v)}
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
                                    onSelect={(v) => setToToken(v)}
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
                        percent={ratio}
                        format={() => `${Number(ratio * 10).toFixed(2)}%`}
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
