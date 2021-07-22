import React, { useEffect, useState, useMemo } from 'react';
import { useConfig, useExchangeSystem } from '@/hooks/useContract'
import Tokens from '@/config/constants/tokens';
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import {
    toFixedWithoutRound,
    expandToNDecimals,
    expandTo18Decimals,
} from '@/utils/bigNumber';
import { InputNumber, Button, Select, Radio, message } from 'antd';
import { COLLATERAL_TOKENS, MINT_TOKENS, TokenPrices } from '@/config';
import { useBep20Balance } from '@/hooks/useTokenBalance'
import './index.less';
import EstimateData from './components/EstimateData'
import { debounce } from 'lodash'
//Fixme: for test
const TO_TOKENS = ['lBTC'];
const FROM_TOKENS = ['FUSD'];


export default () => {

    const configContract = useConfig()
    const exchangeSystem = useExchangeSystem()
    const { account } = useWeb3React()
    const [fromToken, setFromToken] = useState(FROM_TOKENS[0])
    const [fromAmount, setFromAmount] = useState(0.0)
    const [toToken, setToToken] = useState(TO_TOKENS[0])
    const [toAmount, setToAmount] = useState(0.0)
    const [fromBalance, setFromBalance] = useState(0.0)
    const [submitting, setSubmitting] = useState(false)
    const [feeRate, setFeeRate] = useState(0)


    const { balance: fromTokenBalance } = useBep20Balance(fromToken)
    const { balance: toTokenBalance } = useBep20Balance(toToken)

    const getFeeRate = async () => {
        if (toToken) {
            const res = await configContract.getUint(ethers.utils.formatBytes32String(toToken))
            const value = ethers.utils.formatUnits(res, 18)
            console.log('feeRate: ', value)
            setFeeRate(parseFloat(value))
        }
    }

    useEffect(() => {
        getFeeRate()
    }, [configContract, toToken])

    useEffect(() => {
        const val = TokenPrices[fromToken] * fromAmount / TokenPrices[toToken]
        const toAmount = toFixedWithoutRound(val, 2)
        setToAmount(parseFloat(toAmount))
    }, [fromToken, fromAmount, toToken])

    const estimateAmount = useMemo(() => {
        const val = TokenPrices[fromToken] * fromAmount * (1 - feeRate) / TokenPrices[toToken]
        return toFixedWithoutRound(val, 2)
    }, [feeRate, fromAmount, fromToken, toToken])


    const fromAmountHandler = (v) => {
        setFromAmount(v)
    }

    const toAmountHandler = debounce((v) => {
        if (v && toToken) {
            const _amount = TokenPrices[toToken] * v / TokenPrices[fromToken]
            if (_amount > parseFloat(fromTokenBalance)) {
                message.error(`From token balance is not enough. Need ${_amount} ${fromToken}`)
                setToAmount(0)
                return;
            }
            setToAmount(v)
        }
    }, 500)

    const onSubmit = async () => {
        if (!fromAmount || !toAmount) {
            message.warning('From amount and to amount are required')
            return
        }
        try {
            setSubmitting(true)
            const tx = await exchangeSystem.exchange(
                ethers.utils.formatBytes32String(fromToken), // sourceKey
                expandTo18Decimals(fromAmount), // sourceAmount
                account, // destAddr
                ethers.utils.formatBytes32String(toToken) // destKey
            )
            message.info(
                'Trade tx sent out successfully. Pls wait for a while......',
            );
            const receipt = await tx.wait();
            console.log(receipt);
            setSubmitting(false);
            message.success('Tx confirmed. Pls wait for the delay and then check your balance.');
        } catch (err) {
            setSubmitting(false);
            console.log(err);
        }
    }

    return <div className="trade_container">
        <div className="trade-from">
            <div className="input-item">
                <p className="label">From</p>
                <div className="input-item-content">
                    <div className="content-label">
                        <p className="left"></p>
                        <p className="right">
                            Balance:{' '}
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
                            <Select
                                value={fromToken}
                                onSelect={v => setFromToken(fromToken)}
                                placeholder="Select a Token"
                            >
                                {FROM_TOKENS.map((item) => (
                                    <Select.Option value={item} key={item}>
                                        {item}
                                    </Select.Option>
                                ))}
                            </Select>
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
                            <Select
                                value={toToken}
                                onSelect={v => setToToken(v)}
                                placeholder="Select a Token"
                            >
                                {TO_TOKENS.map((item) => (
                                    <Select.Option value={item} key={item}>
                                        {item}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                </div>
                <Button
                    className="btn-mint"
                    onClick={onSubmit}
                    loading={submitting}
                >
                    Trade
                </Button>
            </div>
        </div>
        <EstimateData feeRate={feeRate} receivedAmount={parseFloat(estimateAmount)} receivedToken={toToken} />
    </div>;
};
