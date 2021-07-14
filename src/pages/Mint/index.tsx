import React, { useState, useEffect, useMemo } from 'react';
import { InputNumber, Select, Progress, message } from 'antd';
import { useIntl } from 'umi';
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
import './index.less';

//TODO 从dex 获取质押token的价格。现在假定1fToken=1U，1BTC=5000U，1ETH=2000U
const prices = { BTC_USDT: 5000, ETH_USDT: 2000, fToken_USDT: 1, USDT_USDT: 1 };

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

    const { balance } = useTokenBalance(
        Tokens.fToken.address[process.env.APP_CHAIN_ID],
    );

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
                    prices[collateralToken + '_USDT'] *
                    0.3) /
                prices['fToken_USDT'];
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
                Number(collateralAmount) * prices[collateralToken + '_USDT'];
            const fTokenVal = lockedAmount
                ? Number(lockedAmount) * prices['fToken_USDT']
                : 0;
            const ratio = initRatio * (1 - fTokenVal / collateralVal) * 10;
            return ratio;
        }
    }, [collateralAmount, collateralToken, lockedAmount]);

    // 计算toAmount
    useEffect(() => {
        if (ratio >= 20 && toToken && collateralAmount) {
            debugger;
            const val =
                (Number(collateralAmount) * prices[collateralToken + '_USDT']) /
                (ratio / 10);
            const amount = val / prices[toToken.substr(1) + '_USDT'];
            setToAmount(amount);
        } else {
            setToAmount(0);
        }
    }, [collateralToken, collateralAmount, lockedAmount, ratio, toToken]);

    const collateralAmountHandler = (v) => {
        setCollateralAmount(v);
    };

    const lockedAmountHandler = (v) => {
        if (Number(v) > maxLockedAmount) {
            setLockedAmount(0);
            message.warning('锁仓价值不能超过质押价值的3/10');
            return;
        }
        setLockedAmount(v);
    };

    const onSubmit = () => {};

    return (
        <div className="mint-container">
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
                            <span className="balance">{collateralBalance}</span>
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
                <p className="label">{intl.formatMessage({ id: 'mint.to' })}</p>
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
                <Progress percent={ratio} format={() => `${ratio * 10}%`} />
            </div>

            <button className="btn-mint" onClick={onSubmit}>
                {intl.formatMessage({ id: 'mint.mint' })}
            </button>
        </div>
    );
};
