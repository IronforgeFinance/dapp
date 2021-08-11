import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useConfig, useExchangeSystem, usePrices } from '@/hooks/useContract';
import Tokens from '@/config/constants/tokens';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {
    toFixedWithoutRound,
    expandToNDecimals,
    expandTo18Decimals,
} from '@/utils/bigNumber';
import { InputNumber, Button, Select, Radio, message } from 'antd';
import { COLLATERAL_TOKENS, MINT_TOKENS, TokenPrices } from '@/config';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import './index.less';
import EstimateData from './components/EstimateData';
import Contracts from '@/config/constants/contracts';
import SelectTokens from '@/components/SelectTokens';
import { debounce } from 'lodash';
import classNames from 'classnames';

//TODO: for test.从配置中读取
const TOKEN_OPTIONS = [
    { name: 'lBTC-202112' },
    { name: 'FUSD' },
    { name: 'lBTC' },
];

export default () => {
    const configContract = useConfig();
    const exchangeSystem = useExchangeSystem();
    const { account } = useWeb3React();
    const [fromToken, setFromToken] = useState(TOKEN_OPTIONS[0].name);
    const [fromAmount, setFromAmount] = useState(0.0);
    const [toggle, setToggle] = useState(false);
    const [toToken, setToToken] = useState(TOKEN_OPTIONS[1].name);
    const [toAmount, setToAmount] = useState(0.0);
    const [fromBalance, setFromBalance] = useState(0.0);
    const [submitting, setSubmitting] = useState(false);
    const [feeRate, setFeeRate] = useState(0);
    const [estimateAmount, setEstimateAmount] = useState(0);

    const prices = usePrices();

    const { balance: fromTokenBalance } = useBep20Balance(fromToken);
    const { balance: toTokenBalance } = useBep20Balance(toToken);

    const getTokenPrice = async (token: string) => {
        if (!token) return 0;
        const res = await prices.getPrice(
            ethers.utils.formatBytes32String(token),
        );
        const val = parseFloat(ethers.utils.formatEther(res));
        if (val === 0) {
            throw new Error('Wrong token price: ' + token);
        }
        return val;
    };

    const getFeeRate = async () => {
        if (toToken) {
            const res = await configContract.getUint(
                ethers.utils.formatBytes32String(toToken),
            );
            const value = ethers.utils.formatUnits(res, 18);
            console.log('feeRate: ', value);
            setFeeRate(parseFloat(value));
        }
    };

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

    useEffect(() => {
        getFeeRate();
    }, [configContract, toToken]);

    const computeToAmount = debounce(async () => {
        const fromTokenPrice = await getTokenPrice(fromToken);
        const toTokenPrice = await getTokenPrice(toToken);
        const val = (fromTokenPrice * fromAmount) / toTokenPrice;
        const toAmount = toFixedWithoutRound(val, 2);
        setToAmount(parseFloat(toAmount));
    }, 500);
    useEffect(() => {
        computeToAmount();
    }, [fromToken, fromAmount, toToken]);

    const computeEstimateAmount = debounce(async () => {
        const fromTokenPrice = await getTokenPrice(fromToken);
        const toTokenPrice = await getTokenPrice(toToken);
        const val =
            (fromTokenPrice * fromAmount * (1 - feeRate)) / toTokenPrice;
        const amount = parseFloat(toFixedWithoutRound(val, 6));
        setEstimateAmount(amount);
    }, 500);
    useEffect(() => {
        computeEstimateAmount();
    }, [feeRate, fromAmount, fromToken, toToken]);

    const fromAmountHandler = (v) => {
        setFromAmount(v);
    };

    const toAmountHandler = debounce((v) => {
        if (v && toToken) {
            const _amount = (TokenPrices[toToken] * v) / TokenPrices[fromToken];
            if (_amount > parseFloat(fromTokenBalance as string)) {
                message.error(
                    `From token balance is not enough. Need ${_amount} ${fromToken}`,
                );
                setToAmount(0);
                return;
            }
            setToAmount(v);
        }
    }, 500);

    const settleTrade = async (entryId: number) => {
        const res = await exchangeSystem.settle(entryId);
        console.log(res);
    };

    // 超时的只能revert
    const revertTrade = async (entryId: number) => {
        const res = await exchangeSystem.revertPendingExchange(entryId);
        console.log(res);
    };

    const onSubmit = async () => {
        // await revertTrade(3);
        // await revertTrade(4);
        // return;
        if (!fromAmount || !toAmount) {
            message.warning('From amount and to amount are required');
            return;
        }
        try {
            setSubmitting(true);
            const tx = await exchangeSystem.exchange(
                ethers.utils.formatBytes32String(fromToken), // sourceKey
                expandTo18Decimals(fromAmount), // sourceAmount
                account, // destAddr
                ethers.utils.formatBytes32String(toToken), // destKey
            );
            message.info(
                'Trade tx sent out successfully. Pls wait for a while......',
            );
            const receipt = await tx.wait();
            console.log(receipt);
            handleTxReceipt(receipt);
            setSubmitting(false);
            message.success(
                'Tx confirmed. Pls wait for the delay and then check your balance.',
            );
        } catch (err) {
            setSubmitting(false);
            console.log(err);
        }
    };

    //TODO to be removed
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
    const WhiteSpace = () => (
        <span
            dangerouslySetInnerHTML={{
                __html: '&nbsp;',
            }}
        />
    );

    const hasInputtedAmount = useMemo(() => {
        return fromAmount > 0 || toAmount > 0;
    }, [fromAmount, toAmount]);

    const SelectFromTokensView = () => {
        const [show, setShow] = useState(false);
        const _closeHandler = useCallback(() => setShow(false), []);
        const _showHandler = useCallback(() => setShow(true), []);

        const DefaultView = () => {
            return <span>Select token</span>;
        };

        return (
            <SelectTokens
                visable={show}
                value={fromToken}
                tokenList={TOKEN_OPTIONS}
                onSelect={(v) => setFromToken(v)}
                onClose={_closeHandler}
            >
                <button className="btn-mint-form" onClick={_showHandler}>
                    <span>{fromToken || <DefaultView />}</span>
                    <i className="icon-down size-20"></i>
                </button>
            </SelectTokens>
        );
    };

    const SelectToTokensView = () => {
        const [show, setShow] = useState(false);
        const _closeHandler = useCallback(() => setShow(false), []);
        const _showHandler = useCallback(() => setShow(true), []);

        const DefaultView = () => {
            return <span>Select token</span>;
        };

        return (
            <SelectTokens
                visable={show}
                value={toToken}
                tokenList={TOKEN_OPTIONS}
                onSelect={(v) => setToToken(v)}
                onClose={_closeHandler}
            >
                <button className="btn-mint-form" onClick={_showHandler}>
                    <span>{toToken || <DefaultView />}</span>
                    <i className="icon-down size-20"></i>
                </button>
            </SelectTokens>
        );
    };

    return (
        <div className="trade-container">
            <div className="shop common-box">
                <div className="roof" />
                <div
                    className={classNames({
                        sign: true,
                        active: hasInputtedAmount,
                    })}
                />
                <div className="form">
                    <div className="input-item">
                        <p className="label">From</p>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left"></p>
                                <p className="right">
                                    Balance:
                                    <WhiteSpace />
                                    <span className="balance">
                                        {fromTokenBalance}
                                    </span>
                                </p>
                            </div>
                            <div className="input">
                                <InputNumber
                                    value={fromAmount}
                                    onChange={fromAmountHandler}
                                    placeholder="0.00"
                                    className="custom-input"
                                    min={0}
                                />
                                <div className="token">
                                    <SelectFromTokensView />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="input-item">
                        <p className="label">To</p>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left"></p>
                                <p className="right">
                                    Balance:{' '}
                                    <span className="balance">
                                        {toTokenBalance}
                                    </span>
                                </p>
                            </div>
                            <div className="input">
                                <InputNumber
                                    value={toAmount}
                                    onChange={toAmountHandler}
                                    placeholder="0.00"
                                    className="custom-input"
                                    disabled={!toToken}
                                    min={0}
                                />
                                <div className="token">
                                    <SelectToTokensView />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="btn-trade common-btn common-btn-red"
                        onClick={onSubmit}
                        loading={submitting}
                    >
                        Trade
                    </Button>
                    <span className="fee-cost">Fee cost：0</span>
                </div>
            </div>
            <div
                className={classNames({
                    'market-details': true,
                    hide: toggle,
                    show: !toggle,
                })}
            >
                <button
                    className="btn-skip"
                    onClick={() => setToggle(!toggle)}
                />
                <p className="details">
                    Market Details:
                    <WhiteSpace />
                    <span className="token-pair">fBTC/fETH</span>
                </p>
                <span className="token">fBTC</span>
                <ul>
                    <li>
                        <span className="label">24H volume </span>
                        <span className="value">2222</span>
                    </li>
                    <li>
                        <span className="label">Market Cap </span>
                        <span className="value">2222</span>
                    </li>
                    <li>
                        <span className="label">24H High </span>
                        <span className="value">2222</span>
                    </li>
                    <li>
                        <span className="label">24H Low </span>
                        <span className="value">2222</span>
                    </li>
                    <li>
                        <span className="label">Price Feed </span>
                        <span className="value">2222</span>
                    </li>
                    <li>
                        <span className="label">fBTC Contract </span>
                        <span className="value">2222</span>
                    </li>
                    {/* ))} */}
                </ul>
            </div>
            {/* <EstimateData
                feeRate={feeRate}
                receivedAmount={parseFloat(estimateAmount)}
                receivedToken={toToken}
            /> */}
        </div>
    );
};
