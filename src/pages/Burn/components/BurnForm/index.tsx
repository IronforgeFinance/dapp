import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InputNumber, Button, Select, Radio, message } from 'antd';
import './index.less';
import { useModel } from 'umi';
import { useCollateralSystem, usePrices } from '@/hooks/useContract';
import Tokens from '@/config/constants/tokens';
import {
    toFixedWithoutRound,
    expandToNDecimals,
    expandTo18Decimals,
} from '@/utils/bigNumber';
import { ethers } from 'ethers';
import { COLLATERAL_TOKENS, MINT_TOKENS, TokenPrices } from '@/config';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import useDataView, { useSelectedDebtInUSD } from '@/hooks/useDataView';
import { useInitialRatio } from '@/hooks/useConfig';
import BigNumber from 'bignumber.js';

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
    const [burnInitialAvailable, setBurnInitialAvailable] = useState(false);
    const [burnMaxAvailable, setBurnMaxAvailable] = useState(false);

    const { currencyRatio } = useDataView(toToken);

    const toTokenDebtInUsd = useSelectedDebtInUSD(toToken);

    const initialRatio = useInitialRatio(toToken);

    const { selectedDebtItemInfos, selectedDebtInUSD } = useModel(
        'burnData',
        (model) => ({
            selectedDebtItemInfos: model.selectedDebtInfos,
            selectedDebtInUSD: model.selectedDebtInUSD,
        }),
    );
    const {
        debtData,
        setDebtData,
        fRatioData,
        setfRadioData,
        stakedData,
        setStakedData,
    } = useModel('dataView', (model) => ({
        ...model,
    }));

    const { balance: fusdBalance } = useBep20Balance('FUSD');

    const collateralSystem = useCollateralSystem();
    const prices = usePrices();
    const { account } = useWeb3React();

    const burnAmountHandler = (v) => {
        setBurnAmount(v);
        setDebtData({
            ...debtData,
            endValue: debtData.startValue - v,
        });
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

    // useEffect(() => {
    //     // Fixme 固定ratio 500%， 设置unstaking amount
    //     if (toToken && burnAmount && !burnType) {
    //         const val = parseFloat(
    //             toFixedWithoutRound((burnAmount * 5) / TokenPrices[toToken], 2),
    //         );
    //         const debtInfo = selectedDebtItemInfos.find(
    //             (item) => item.collateralToken === toToken,
    //         );
    //         if (debtInfo && val > debtInfo.debt) {
    //             setUnstakeAmount(debtInfo.debt);
    //             const _burn = parseFloat(
    //                 toFixedWithoutRound(
    //                     (debtInfo.debt * TokenPrices[toToken]) / 5,
    //                     2,
    //                 ),
    //             );
    //             setBurnAmount(_burn);
    //         }
    //         setUnstakeAmount(val);
    //     }
    // }, [burnAmount, toToken, burnType]);

    useEffect(() => {
        //
        if (!toToken) {
            setBurnInitialAvailable(false);
            setBurnMaxAvailable(false);
        } else {
            /*TODO 计算toToken的 ratio.
            只有质押率小于初始质押率才可点击burn to initial
            钱包余额大于等于债务数，则可直接burn to max
            钱包余额小于债务数，用户执行一个burn to max操作，实际上进行两个合约步骤：
                1.直接用bnb进行债务购买来补充钱包不足的债务，
                2.购买后，钱包余额大于等于债务数，正常燃烧
            */
            if (currencyRatio < initialRatio) {
                setBurnInitialAvailable(true);
            } else {
                setBurnInitialAvailable(false);
            }
            setBurnMaxAvailable(true);
            if (fusdBalance > selectedDebtInUSD) {
                // 不能直接burn max。
            } else {
                // 可以直接burn max
            }
        }
    }, [toToken, currencyRatio, initialRatio]);

    // 计算burned 和unstaking amount
    //TODO 替换 collateralSystem.getUserCollateralInUsd 方法。还没部署。
    const burnInitialHandler = async () => {
        setUnstakeAmount(0);
        const userCollateral = await collateralSystem.getUserCollateral(
            account,
            ethers.utils.formatBytes32String(toToken),
        );
        const price = await prices.getPrice(
            ethers.utils.formatBytes32String(toToken),
        );
        const userCollateralInUsd = new BigNumber(
            ethers.utils.formatEther(userCollateral),
        ).multipliedBy(ethers.utils.formatEther(price));
        const burnAmount =
            toTokenDebtInUsd -
            userCollateralInUsd.dividedBy(initialRatio).toNumber();
        setBurnAmount(burnAmount);
        setDebtData({
            ...debtData,
            endValue: debtData.startValue - burnAmount,
        });
        setfRadioData({
            ...fRatioData,
            endValue: initialRatio * 100,
        });
    };

    /* 如果余额小于债务 提示进行两个交易，tx1用账户里bnb去购买fusd，tx2进行unstake
    合约暂时不支持这样的两步操作。所以页面上就提示用户需要购买fusd，保证账户余额大于债务。
    */
    const burnMaxHandler = async () => {
        if (fusdBalance < toTokenDebtInUsd) {
            message.warning(
                '钱包余额不足。请到dex购买fUSD，保证余额大于您的债务',
                5,
            );
        } else {
            setUnstakeAmount(toTokenDebt);
            const price = await prices.getPrice(
                ethers.utils.formatBytes32String(toToken),
            );
            const userCollateralInUsd = new BigNumber(toTokenDebt).multipliedBy(
                ethers.utils.formatEther(price),
            );
            const burnAmount = userCollateralInUsd
                .dividedBy(initialRatio)
                .toNumber();
            setBurnAmount(burnAmount);
            setDebtData({
                ...debtData,
                endValue: debtData.startValue - burnAmount,
            });
            setfRadioData({
                ...fRatioData,
                endValue: 0,
            });
            setStakedData({
                ...stakedData,
                endValue:
                    stakedData.startValue - userCollateralInUsd.toNumber(),
            });
        }
    };

    const onSubmit = async () => {
        if (!burnAmount && !unstakeAmount) {
            message.warning('Burned amount and unstaking can not be both 0');
            return;
        }
        if (Number(burnAmount) > Number(selectedDebtInUSD)) {
            message.error('Burned amount is greater than debt.');
            return;
        }
        if (fusdBalance < toTokenDebtInUsd) {
            message.warning(
                '钱包余额不足。请到dex购买fUSD，保证余额大于您的债务',
                5,
            );
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
            if (burnType === 'max') {
                const tx = await collateralSystem.burnAndUnstake(
                    expandTo18Decimals(burnAmount), // burnAmount
                    ethers.utils.formatBytes32String(toToken!), // unstakeCurrency
                );
                message.info(
                    'Burn tx sent out successfully. Pls wait for a while......',
                );
                const receipt = await tx.wait();
                console.log(receipt);
            } else {
                const token: any = Tokens[toToken!];
                const decimals = token.decimals;
                console.log('decimals: ', decimals);
                console.log(
                    expandToNDecimals(unstakeAmount, decimals).toString(),
                );
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
            }

            setSubmitting(false);
            message.success('Burn successfully. Pls check your balance.');
            onSubmitSuccess();
            //TODO 触发ratio更新
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
                            <span className="balance">{fusdBalance} fUSD</span>
                        </p>
                    </div>
                    <div className="input">
                        <InputNumber
                            value={burnAmount}
                            onChange={burnAmountHandler}
                            placeholder="0.00"
                            className="custom-input"
                            min={0}
                            max={selectedDebtInUSD || 9999999}
                        />
                        <div className="token">(Debt:${selectedDebtInUSD})</div>
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
                            min={0}
                            max={toTokenDebt}
                        />
                        <div className="token">
                            <Select
                                value={toToken}
                                onSelect={toTokenHandler}
                                placeholder="Select a Token"
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
                        <Radio.Button
                            onClick={burnInitialHandler}
                            value="initial"
                            disabled={!burnInitialAvailable}
                        >
                            Burn to initial
                        </Radio.Button>
                        <Radio.Button
                            value="max"
                            onClick={burnMaxHandler}
                            disabled={!burnMaxAvailable}
                        >
                            Burn Max
                        </Radio.Button>
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
