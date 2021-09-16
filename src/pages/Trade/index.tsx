import './less/index.less';

import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useContext,
} from 'react';
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
import EstimateData from './components/EstimateData';
import Contracts from '@/config/constants/contracts';
import MarketDetail from './components/MarketDetail';
import { debounce } from 'lodash';
import classNames from 'classnames';
import { TokenIcon } from '@/components/Icon';
import { useIntl, useModel } from 'umi';
import { getTokenPrice } from '@/utils';
import { TokenSelectorContext } from '@/components/TokenSelector';
import { TransitionConfirmContext } from '@/components/TransactionConfirm';
//TODO: for test.从配置中读取
const TOKEN_OPTIONS = MINT_TOKENS.map((token) => ({ name: token }));

export default () => {
    const intl = useIntl();
    const configContract = useConfig();
    const exchangeSystem = useExchangeSystem();
    const { open } = useContext(TokenSelectorContext);
    const { open: openConfirmModal } = useContext(TransitionConfirmContext);
    const { account } = useWeb3React();
    const [fromToken, setFromToken] = useState(TOKEN_OPTIONS[0].name);
    const [fromAmount, setFromAmount] = useState<number | undefined>();
    const [toToken, setToToken] = useState(TOKEN_OPTIONS[1].name);
    const [toAmount, setToAmount] = useState<number | undefined>();
    const [fromBalance, setFromBalance] = useState(0.0);
    const [submitting, setSubmitting] = useState(false);
    const [feeRate, setFeeRate] = useState(0);
    const [estimateAmount, setEstimateAmount] = useState(0);
    const [showSelectFromToken, setShowSelectFromToken] = useState(false);
    const [showSelectToToken, setShowSelectToToken] = useState(false);

    useEffect(() => {
        (async () => {
            const canRevert = await exchangeSystem.canOnlyBeReverted(1);
            console.log('canRevert: ', canRevert);
        })();
    }, []);
    const prices = usePrices();

    const { requestConnectWallet } = useModel('app', (model) => ({
        requestConnectWallet: model.requestConnectWallet,
    }));

    const { balance: fromTokenBalance } = useBep20Balance(fromToken);
    const { balance: toTokenBalance } = useBep20Balance(toToken, 6);

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
        const toAmount = toFixedWithoutRound(val, 6);
        setToAmount(toAmount || undefined);
    }, 500);
    useEffect(() => {
        computeToAmount();
    }, [fromToken, fromAmount, toToken]);

    const computeEstimateAmount = debounce(async () => {
        const fromTokenPrice = await getTokenPrice(fromToken);
        const toTokenPrice = await getTokenPrice(toToken);
        const val =
            (fromTokenPrice * fromAmount * (1 - feeRate)) / toTokenPrice;
        const amount = toFixedWithoutRound(val, 6);
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

    /**@description 交易前的确认 */
    const openMintConfirm = useCallback(async () => {
        setSubmitting(true);

        const fromTokenPrice = await getTokenPrice(fromToken);
        const toTokenPrice = await getTokenPrice(toToken);

        openConfirmModal({
            view: 'trade',
            fromToken: {
                name: fromToken,
                price: Number((fromTokenPrice * fromAmount).toFixed(2)),
                amount: fromAmount,
            },
            toToken: {
                name: toToken,
                price: Number((toTokenPrice * toAmount).toFixed(2)),
                amount: toAmount,
            },
            confirm: onSubmit,
            final: () => setSubmitting(false),
        });
    }, [toToken, toAmount, fromToken, fromAmount]);

    const hasInputtedAmount = useMemo(() => {
        return fromAmount > 0 || toAmount > 0;
    }, [fromAmount, toAmount]);

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

    const openFromTokenList = useCallback(
        () => open(TOKEN_OPTIONS, { callback: fromTokenHandler }),
        [],
    );

    const openToTokenList = useCallback(
        () => open(TOKEN_OPTIONS, { callback: toTokenHandler }),
        [],
    );

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
                        <p className="label">
                            {intl.formatMessage({ id: 'trade.from' })}
                        </p>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left"></p>
                                <p className="right">
                                    {intl.formatMessage({
                                        id: 'balance:',
                                    })}{' '}
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
                                    type="number"
                                />
                                <div className="token">
                                    <TokenIcon
                                        size={24}
                                        name={fromToken}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Button
                                        className="select-token-btn"
                                        onClick={openFromTokenList}
                                    >
                                        {fromToken}
                                        <i className="icon-down size-24" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <i className="icon-arrow-down size-18" />
                    <div className="input-item">
                        <p className="label">
                            {intl.formatMessage({ id: 'trade.to' })}
                        </p>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left"></p>
                                <p className="right">
                                    {intl.formatMessage({
                                        id: 'balance:',
                                    })}
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
                                    type="number"
                                />
                                <div className="token">
                                    <TokenIcon
                                        size={24}
                                        name={toToken}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Button
                                        className="select-token-btn"
                                        onClick={openToTokenList}
                                    >
                                        {toToken}
                                        <i className="icon-down size-24" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {account && (
                        <Button
                            className="btn-trade common-btn common-btn-red"
                            disabled={!canTrade}
                            onClick={openMintConfirm}
                            loading={submitting}
                        >
                            {intl.formatMessage({
                                id: 'trade.button',
                            })}
                        </Button>
                    )}
                    {!account && (
                        <Button
                            className="disaconnect-btn common-btn common-btn-yellow"
                            onClick={() => {
                                requestConnectWallet();
                            }}
                        >
                            {intl.formatMessage({
                                id: 'app.unlockWallet',
                            })}
                        </Button>
                    )}
                    <span className="fee-cost">
                        {intl.formatMessage({ id: 'trade.feecost' })}
                        {feeRate * 100 + '%'}
                    </span>
                </div>
            </div>
            <MarketDetail token0={fromToken} token1={toToken} />
        </div>
    );
};
