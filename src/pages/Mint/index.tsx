import React, { useState, useEffect, useMemo } from 'react';
import { InputNumber, Select, Progress, message } from 'antd';
import { useIntl, useModel } from 'umi';
import IconDown from '@/assets/images/down.svg';
import IconAdd from '@/assets/images/add.svg';
import { COLLATERAL_TOKENS, MINT_TOKENS } from '@/config';
import { useERC20 } from '@/hooks/useContract';
import useTokenBalance from '@/hooks/useTokenBalance';
import { useWeb3React } from '@web3-react/core';
import { getBep20Contract } from '@/utils/contractHelper';
import Tokens from '@/config/constants/tokens';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import DataView from './DataView';
import { debounce } from 'lodash';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import './index.less';

//TODO 从Prices合约接口获取质押token的价格。现在假定1fToken=1U，1BTC=5000U，1ETH=2000U
const TokenPrices = {
    BTC: 5000,
    ETH: 2000,
    fToken: 1,
    USDT: 1,
    fBTC: 5000,
    fUSDT: 1,
    fETH: 2000,
};

export default () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const [collateralAmount, setCollateralAmount] = useState();
    const [lockedAmount, setLockedAmount] = useState<undefined | number>();
    const [toAmount, setToAmount] = useState<undefined | number>();
    const [collateralBalance, setCollateralBalance] = useState('0.00');
    const [collateralToken, setCollateralToken] = useState('USDT');
    // const [fTokenBalance, setFTokenBalance] = useState('0.00')
    const [toToken, setToToken] = useState();

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
        Tokens.fToken.address[process.env.APP_CHAIN_ID],
    );

    const erc20 = useERC20(Tokens['USDT'].address[56]);

    const fTokenBalance = balance.toFixed(2);
    const fetchBEP20Balance = async (token) => {
        if (!account) return;
        const tokenObj = Tokens[token];
        if (!token) return;
        const contract = getBep20Contract(
            tokenObj.address[process.env.APP_CHAIN_ID],
        );
        const res = await contract.balanceOf(account);
        const amount = ethers.utils.formatUnits(res, tokenObj.decimals);
        console.log('fetchBEP20Balance: ', token, amount);
        return new BigNumber(amount).toFixed(2);
    };

    useEffect(() => {
        (async () => {
            const amount = await fetchBEP20Balance(collateralToken);
            setCollateralBalance(amount);
        })();
    }, [collateralToken, account]);

    useEffect(() => {
        (async () => {
            const amount = await fetchBEP20Balance(collateralToken);
            setCollateralBalance(amount);
        })();
    }, [account]);

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
            COLLATERAL_TOKENS.find((item) => item.name === collateralToken)
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
            COLLATERAL_TOKENS.find((item) => item.name === collateralToken)
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
            const val = parseFloat(
                new BigNumber(toAmount)
                    .multipliedBy(TokenPrices[toToken])
                    .toFixed(2),
            );
            setDebtData({
                ...debtData,
                endValue: val,
            });
        }
    }, [toToken, toAmount]);
    const collateralAmountHandler = debounce((v) => {
        setCollateralAmount(v);
        const currentStakeValue = Number(v) * TokenPrices[collateralToken];
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

    const onSubmit = () => {};

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

                <button className="btn-mint" onClick={onSubmit}>
                    {intl.formatMessage({ id: 'mint.mint' })}
                </button>
            </div>
        </div>
    );
};
