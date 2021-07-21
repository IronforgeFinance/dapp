import React, { useState, useEffect } from 'react';
import { InputNumber, Button, Select, Radio, message } from 'antd';
import './index.less';
import { useModel } from 'umi';
import { useCollateralSystem } from '@/hooks/useContract';
import Tokens from '@/config/constants/tokens';
import {
    toFixedWithoutRound,
    expandToNDecimals,
    expandTo18Decimals,
} from '@/utils/bigNumber';
import { ethers } from 'ethers';
import { COLLATERAL_TOKENS, MINT_TOKENS, TokenPrices } from '@/config';

const TO_TOKENS = ['BTC'];
interface IProps {
    onSubmitSuccess: () => void;
}
export default (props: IProps) => {
    const { onSubmitSuccess } = props;
    const [debtBalance, setDebtBalance] = useState(0.0);
    const [burnAmount, setBurnAmount] = useState<number>();
    const [unstakeAmount, setUnstakeAmount] = useState<number>();
    const [toToken, setToToken] = useState<string>();
    const [toTokenDebt, setToTokenDebt] = useState(0.0);
    const [burnType, setBurnType] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { selectedDebtItemInfos, selectedDebtInUSD } = useModel(
        'dataView',
        (model) => ({
            selectedDebtItemInfos: model.selectedDebtInfos,
            selectedDebtInUSD: model.selectedDebtInUSD,
        }),
    );

    const collateralSystem = useCollateralSystem();

    const burnAmountHandler = (v) => {
        setBurnAmount(v);
    };

    const unstakeAmountHandler = (v) => {
        setUnstakeAmount(v);
    };

    const toTokenHandler = (v) => {
        const debt = selectedDebtItemInfos.find(
            (item) => item.collateralToken === v,
        );
        if (debt) {
            setToTokenDebt(debt.debt);
        }
        setToToken(v);
    };

    useEffect(() => {
        // Fixme 固定ratio 500%， 设置unstaking amount
        if (toToken && burnAmount) {
            const val = parseFloat(
                toFixedWithoutRound((burnAmount * 5) / TokenPrices[toToken], 2),
            );
            const debtInfo = selectedDebtItemInfos.find(
                (item) => item.collateralToken === toToken,
            );
            if (debtInfo && val > debtInfo.debt) {
                setUnstakeAmount(debtInfo.debt);
                const _burn = parseFloat(
                    toFixedWithoutRound(
                        (debtInfo.debt * TokenPrices[toToken]) / 5,
                        2,
                    ),
                );
                setBurnAmount(_burn);
            }
            setUnstakeAmount(val);
        }
    }, [burnAmount, toToken]);

    // 无限循环
    // useEffect(() => {
    //     if (toToken && unstakeAmount) {
    //         const val = parseFloat(toFixedWithoutRound(TokenPrices[toToken] * unstakeAmount / 5, 2))
    //         if (val > selectedDebtInUSD) {
    //             message.error('Debt in USD is not enouth')
    //             setBurnAmount(0.0)
    //         }
    //         setBurnAmount(val)
    //     }
    // }, [unstakeAmount, toToken])

    const onSubmit = async () => {
        if (!burnAmount || !unstakeAmount) {
            message.warning('Burned amount and unstaking amount are required');
            return;
        }
        if (Number(burnAmount) > Number(selectedDebtInUSD)) {
            message.error('Burned amount is greater than debt.');
            return;
        }
        const debtInfo = selectedDebtItemInfos.find(
            (item) => item.collateralToken === toToken,
        );

        if (debtInfo && unstakeAmount > Number(debtInfo.debt)) {
            message.error('Unstaking amount is greater than collateral amount');
            return;
        }
        try {
            setSubmitting(true);
            const token: any = Tokens[toToken!];
            const decimals = token.decimals;
            console.log('decimals: ', decimals);
            console.log(expandToNDecimals(unstakeAmount, decimals).toString());
            console.log(expandTo18Decimals(burnAmount).toString());
            const tx = await collateralSystem.burnAndUnstake(
                expandTo18Decimals(burnAmount), // burnAmount
                ethers.utils.formatBytes32String(toToken!), // unstakeCurrency
                expandToNDecimals(unstakeAmount, decimals), // unstakeAmount
            );
            message.info(
                'Burn tx sent out successfully. Pls wait for a while......',
            );
            const receipt = await tx.wait();
            console.log(receipt);
            setSubmitting(false);
            message.success('Burn successfully. Pls check your balance.');
            onSubmitSuccess();
        } catch (err) {
            setSubmitting(false);
            console.log(err);
        }
    };

    return (
        <div className="burn-form">
            <div className="input-item">
                <p className="label">From</p>
                <div className="input-item-content">
                    <div className="content-label">
                        <p className="left">Burned</p>
                        <p className="right">
                            Balance:{' '}
                            <span className="balance">
                                {selectedDebtInUSD} fUSD
                            </span>
                        </p>
                    </div>
                    <div className="input">
                        <InputNumber
                            value={burnAmount}
                            onChange={burnAmountHandler}
                            placeholder="0.00"
                            className="custom-input"
                        />
                    </div>
                </div>
            </div>
            <div className="input-item">
                <p className="label">To</p>
                <div className="input-item-content">
                    <div className="content-label">
                        <p className="left">Unstaking</p>
                    </div>
                    <div className="input">
                        <InputNumber
                            value={unstakeAmount}
                            onChange={unstakeAmountHandler}
                            placeholder="0.00"
                            className="custom-input"
                            disabled={!toToken}
                        />
                        <div className="token">
                            <Select
                                value={toToken}
                                onSelect={toTokenHandler}
                                placeholder="Select a Token"
                            >
                                {TO_TOKENS.map((item) => (
                                    <Select.Option value={item} key={item}>
                                        {item}
                                    </Select.Option>
                                ))}
                            </Select>
                            ({toTokenDebt})
                        </div>
                    </div>
                </div>
            </div>
            <div className="burn-type">
                <p className="tips">You can also choose</p>
                <div className="btns">
                    <Radio.Group
                        onChange={(v) => setBurnType}
                        buttonStyle="solid"
                    >
                        <Radio.Button value="initial">
                            Burn to initial
                        </Radio.Button>
                        <Radio.Button value="max">Burn Max</Radio.Button>
                    </Radio.Group>
                </div>
            </div>
            <div className="btn-burn">
                <Button
                    loading={submitting}
                    className="btn-mint"
                    onClick={onSubmit}
                >
                    Burn
                </Button>
            </div>
        </div>
    );
};
