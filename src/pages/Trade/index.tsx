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
import { InputNumber, Button, Select, Radio } from 'antd';
import * as message from '@/components/Notification';
import { COLLATERAL_TOKENS, MINT_TOKENS } from '@/config';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import './index.less';
import EstimateData from './components/EstimateData';
import Contracts from '@/config/constants/contracts';
import SelectTokens from '@/components/SelectTokens';
import MarketDetail from './MarketDetail';
import { debounce } from 'lodash';
import classNames from 'classnames';
import TransitionConfirm from '@/components/TransitionConfirm';
import { TokenIcon } from '@/components/Icon';
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
    const [toToken, setToToken] = useState(TOKEN_OPTIONS[1].name);
    const [toAmount, setToAmount] = useState(0.0);
    const [fromBalance, setFromBalance] = useState(0.0);
    const [submitting, setSubmitting] = useState(false);
    const [feeRate, setFeeRate] = useState(0);
    const [estimateAmount, setEstimateAmount] = useState(0);
    const [showSelectFromToken, setShowSelectFromToken] = useState(false);
    const [showSelectToToken, setShowSelectToToken] = useState(false);

    const prices = usePrices();

    const { balance: fromTokenBalance } = useBep20Balance(fromToken);
    const { balance: toTokenBalance } = useBep20Balance(toToken);

    const getTokenPrice = async (token: string) => {
        try {
            if (!token) return 0;
            const res = await prices.getPrice(
                ethers.utils.formatBytes32String(token),
            );
            const val = parseFloat(ethers.utils.formatEther(res));
            if (val === 0) {
                throw new Error('Wrong token price: ' + token);
            }
            return val;
        } catch (error) {
            console.error(error);
        }
        return 0;
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

    const toAmountHandler = (v) => {
        setToAmount(v);
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

    const canTrade = React.useMemo(() => {
        return !(fromAmount > fromTokenBalance);
    }, [fromAmount, fromTokenBalance]);

    const [showTxConfirm, setShowTxConfirm] = useState(false);
    const [tx, setTx] = useState<any | null>(null);

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
            setShowTxConfirm(true);
            setTx({
                from: {
                    token: fromToken,
                    amount: fromAmount,
                    price: '--',
                },
                to: {
                    token: toToken,
                    amount: toAmount,
                    price: '--',
                },
            });

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
        } finally {
            setShowTxConfirm(false);
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

    const mockMarketDetailData = {
        token0: 'fBTC',
        token1: 'fETH',
        dataSource: [
            { label: '24H volume', value: { amount: 6668.15 } },
            { label: 'Market Cap', value: { amount: 6668.15 } },
            { label: '24H High', value: { amount: 558.15 } },
            { label: '24H Low', value: { amount: 6668.15 } },
            {
                label: 'Price Feed',
                value: {
                    address: '0xDD21D68304503Efe46be7eCe376afaC77C8067c8',
                },
            },
            {
                label: 'fBTC Contract',
                value: {
                    address: '0xDD21D68304503Efe46be7eCe376afaC77C8067c8',
                },
            },
        ],
    };

    const fromTokenHandler = (v) => {
        if (toToken === v) {
            setToToken(fromToken);
            setToAmount(fromAmount);
            setFromToken(v);
            setFromAmount(toAmount);
        } else {
            setFromToken(v);
        }
    };

    const toTokenHandler = (v) => {
        if (fromToken === v) {
            setFromToken(toToken);
            setFromAmount(toAmount);
            setToToken(v);
            setToAmount(fromAmount);
        } else {
            setToToken(v);
        }
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
                                    <TokenIcon size={24} name={fromToken} />
                                    <SelectTokens
                                        value={fromToken}
                                        tokenList={TOKEN_OPTIONS}
                                        onSelect={fromTokenHandler}
                                    >
                                        <button
                                            className="btn-mint-form"
                                            onClick={() => {
                                                setShowSelectFromToken(true);
                                            }}
                                        >
                                            <span>
                                                {fromToken || (
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
                                    <TokenIcon size={24} name={toToken} />
                                    <SelectTokens
                                        value={toToken}
                                        tokenList={TOKEN_OPTIONS}
                                        onSelect={toTokenHandler}
                                    ></SelectTokens>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="btn-trade common-btn common-btn-red"
                        disabled={!canTrade}
                        onClick={onSubmit}
                        loading={submitting}
                    >
                        Trade
                    </Button>
                    <span className="fee-cost">
                        Fee cost：{feeRate * 100 + '%'}
                    </span>
                </div>
            </div>
            <MarketDetail {...mockMarketDetailData} />
            <TransitionConfirm
                visable={showTxConfirm}
                onClose={() => setShowTxConfirm(false)}
                dataSource={
                    tx && [
                        {
                            label: 'From',
                            direct: 'from',
                            value: {
                                token: tx.from.token,
                                amount: tx.from.amount,
                                mappingPrice: tx.from.price,
                            },
                        },
                        {
                            label: 'To',
                            direct: 'to',
                            value: {
                                token: tx.to.token,
                                amount: tx.to.amount,
                                mappingPrice: tx.to.price,
                            },
                        },
                    ]
                }
            />
        </div>
    );
};
