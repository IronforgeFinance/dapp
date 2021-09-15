import './less/index.less';

import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InputNumber, Button, Select, Radio } from 'antd';
import * as message from '@/components/Notification';
import { useModel } from 'umi';
import { useCollateralSystem, usePrices } from '@/hooks/useContract';
import Tokens from '@/config/constants/tokens';
import {
    toFixedWithoutRound,
    expandToNDecimals,
    expandTo18Decimals,
} from '@/utils/bigNumber';
import { ethers } from 'ethers';
import { COLLATERAL_TOKENS, PLATFORM_TOKEN, MINT_TOKENS } from '@/config';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import useDataView, { useSelectedDebtInUSD } from '@/hooks/useDataView';
import { useInitialRatio } from '@/hooks/useConfig';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import { Group as ScaleGroup, Button as ScaleOption } from '@/components/Scale';
import SelectTokens from '@/components/SelectTokens';
import TransitionConfirm from '@iron/TransitionConfirm';
import { TokenIcon } from '@/components/Icon';
import { useIntl } from 'umi';
import { getTokenPrice } from '@/utils';
import {
    useCheckERC20ApprovalStatus,
    useERC20Approve,
} from '@/hooks/useApprove';
import Contracts from '@/config/constants/contracts';
const TO_TOKENS = ['BTC'];
interface IProps {
    onSubmitSuccess: () => void;
}
export default (props: IProps) => {
    const intl = useIntl();
    const { onSubmitSuccess } = props;
    const [debtBalance, setDebtBalance] = useState(0.0);
    const [burnAmount, setBurnAmount] = useState<number>();
    const [unstakeAmount, setUnstakeAmount] = useState<number>();
    const [fromToken, setFromToken] = useState<string>(MINT_TOKENS[0]);
    const [toToken, setToToken] = useState<string>(COLLATERAL_TOKENS[0].name);
    const [toTokenDebt, setToTokenDebt] = useState(0.0);
    const [burnType, setBurnType] = useState('');
    const [scale, setScale] = useState('');
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
        setfRatioData,
        stakedData,
        setStakedData,
        lockedData,
        setLockedData,
        clearDataView,
    } = useModel('dataView', (model) => ({
        ...model,
    }));

    const { balance: fromTokenBalance } = useBep20Balance(fromToken, 6);
    const collateralSytemContract =
        Contracts.CollateralSystem[process.env.APP_CHAIN_ID!];
    const { isApproved, setLastUpdated } = useCheckERC20ApprovalStatus(
        fromToken,
        collateralSytemContract,
    );
    const { handleApprove, requestedApproval } = useERC20Approve(
        fromToken,
        collateralSytemContract,
        setLastUpdated,
    );

    const collateralSystem = useCollateralSystem();
    const prices = usePrices();
    const { account } = useWeb3React();

    const burnAmountHandler = debounce(async (v) => {
        setBurnAmount(v);
        setDebtData({
            ...debtData,
            endValue: parseFloat((debtData.startValue - v).toFixed(2)),
        });
        if (toToken) {
            let _unstakeAmount;
            const fromTokenPrice = await getTokenPrice(fromToken);
            const toTokenPrice = await getTokenPrice(toToken);
            if (currencyRatio < initialRatio) {
                _unstakeAmount = 0;
            } else {
                _unstakeAmount = toFixedWithoutRound(
                    (v * fromTokenPrice * initialRatio) / toTokenPrice,
                    2,
                );
            }
            if (fromToken !== 'FUSD') {
                setUnstakeAmount(_unstakeAmount * (1 - 0.01)); // 考虑exchange手续费
            } else {
                setUnstakeAmount(_unstakeAmount);
            }
            setStakedData({
                ...stakedData,
                endValue: toFixedWithoutRound(
                    stakedData.startValue - _unstakeAmount * toTokenPrice,
                    2,
                ),
            });
            const ratio =
                debtData.startValue - v > 0
                    ? toFixedWithoutRound(
                          ((stakedData.startValue -
                              _unstakeAmount * toTokenPrice) /
                              (debtData.startValue - v)) *
                              100,
                          2,
                      )
                    : 0;
            setfRatioData({
                ...fRatioData,
                endValue: Number(ratio),
            });
        }
    }, 500);

    const unstakeAmountHandler = debounce(async (v) => {
        setUnstakeAmount(v);
        if (toToken) {
            const toTokenPrice = await getTokenPrice(toToken);
            const fromTokenPrice = await getTokenPrice(fromToken);
            const val = toFixedWithoutRound(
                (v * toTokenPrice) / (initialRatio * fromTokenPrice),
                2,
            );
            setBurnAmount(val);
            setDebtData({
                ...debtData,
                endValue: debtData.startValue - val,
            });
            setStakedData({
                ...stakedData,
                endValue: stakedData.startValue - v * toTokenPrice,
            });
            const ratio =
                debtData.startValue - val > 0
                    ? toFixedWithoutRound(
                          ((stakedData.startValue - v * toTokenPrice) /
                              (debtData.startValue - val)) *
                              100,
                          2,
                      )
                    : 0;
            setfRatioData({
                ...fRatioData,
                endValue: Number(ratio),
            });
        }
    }, 500);

    const toTokenHandler = (v) => {
        setToToken(v);
        setUnstakeAmount(0);
        setBurnAmount(0);
        setBurnType('');
    };

    const fromTokenHandler = (v) => {
        setFromToken(v);
        setBurnType('');
        setUnstakeAmount(0);
        setBurnAmount(0);
    };

    useEffect(() => {
        const debt = selectedDebtItemInfos.find(
            (item) => item.collateralToken === toToken,
        );
        if (debt) {
            setToTokenDebt(debt.collateral);
        }
    }, [toToken]);

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
            if (fromTokenBalance > selectedDebtInUSD) {
                // 不能直接burn max。
            } else {
                // 可以直接burn max
            }
        }
    }, [toToken, currencyRatio, initialRatio]);

    // 计算burned 和unstaking amount
    const burnInitialHandler = async (v) => {
        setBurnType(v);
        setUnstakeAmount(0);
        const res = await collateralSystem.getUserCollateralInUsd(
            account,
            ethers.utils.formatBytes32String(toToken),
        );
        const userCollateralInUsd = new BigNumber(
            ethers.utils.formatEther(res),
        );
        const burnFUSDAmount = parseFloat(
            new BigNumber(
                toTokenDebtInUsd -
                    userCollateralInUsd.dividedBy(initialRatio).toNumber(),
            ).toFixed(2),
        );
        let burnAmount = burnFUSDAmount;
        if (toToken !== 'FUSD') {
            const tokenPrice = await getTokenPrice(toToken);
            burnAmount = parseFloat(
                new BigNumber(burnFUSDAmount).dividedBy(tokenPrice).toFixed(6),
            );
        }
        setBurnAmount(burnAmount);
        setStakedData({
            ...stakedData,
        });
        setDebtData({
            ...debtData,
            endValue: debtData.startValue - burnFUSDAmount,
        });
        setfRatioData({
            ...fRatioData,
            endValue: initialRatio * 100,
        });
        setLockedData({
            ...lockedData,
            endValue: lockedData.startValue,
        });
    };

    /* 如果余额小于债务 提示进行两个交易，tx1用账户里bnb去购买fusd，tx2进行unstake
    合约暂时不支持这样的两步操作。所以页面上就提示用户需要购买fusd，保证账户余额大于债务。
    */
    const burnMaxHandler = async (v) => {
        setBurnType(v);
        const fromTokenPrice = await getTokenPrice(fromToken);
        if (fromTokenBalance * fromTokenPrice < toTokenDebtInUsd) {
            message.warning(
                '钱包余额不足。请到dex购买相应的fAsset，保证金额大于您的债务',
                5,
            );
            return;
        } else {
            setUnstakeAmount(toTokenDebt);
            const price = await getTokenPrice(toToken);
            const userCollateralInUsd = new BigNumber(toTokenDebt).multipliedBy(
                price,
            );
            let burnAmount = toTokenDebtInUsd;
            if (toToken !== 'FUSD') {
                burnAmount = parseFloat(
                    new BigNumber(toTokenDebtInUsd).dividedBy(price).toFixed(6),
                );
            }
            setBurnAmount(burnAmount);
            setDebtData({
                ...debtData,
                endValue: 0,
            });
            setfRatioData({
                ...fRatioData,
                endValue: 0,
            });
            setStakedData({
                ...stakedData,
                endValue:
                    stakedData.startValue - userCollateralInUsd.toNumber(),
            });
            setLockedData({
                ...lockedData,
                endValue: 0,
            });
        }
    };

    const [showTxConfirm, setShowTxConfirm] = useState(false);
    const [tx, setTx] = useState<any | null>(null);

    const onSubmit = async () => {
        if (!burnAmount && !unstakeAmount) {
            message.warning('Burned amount and unstaking can not be both 0');
            return;
        }
        if (Number(burnAmount) > Number(selectedDebtInUSD)) {
            message.error('Burned amount is greater than debt.');
            return;
        }
        if (toTokenDebtInUsd === 0) {
            message.warning(
                'No debt for selected unstaking token. No need to burn.',
            );
            return;
        }
        const fromTokenPrice = await getTokenPrice(fromToken);
        // if (fromTokenBalance * fromTokenPrice < toTokenDebtInUsd) {
        //     message.warning(
        //         '钱包余额不足。请到dex购买fUSD，保证余额大于您的债务',
        //         5,
        //     );
        //     return;
        // }
        if (
            currencyRatio < initialRatio &&
            unstakeAmount > 0 &&
            burnType !== 'max'
        ) {
            message.warning(
                '当前抵押率低于初始抵押率。不能解锁抵押物。请燃烧多余的债务后解锁。',
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
            setShowTxConfirm(true);
            const toTokenPrice = await getTokenPrice(toToken);
            const lockedPrice = await getTokenPrice(PLATFORM_TOKEN);
            const unlockedAmount = lockedData.startValue - lockedData.endValue;
            setTx({
                from: {
                    token: fromToken,
                    amount: burnAmount,
                    price: fromTokenPrice,
                },
                to: {
                    token: toToken,
                    amount: unstakeAmount,
                    price: (toTokenPrice * unstakeAmount).toFixed(2),
                },
                locked: {
                    token: 'BS',
                    amount: lockedData.startValue - lockedData.endValue,
                    price: (lockedPrice * unlockedAmount).toFixed(2),
                },
            });
            if (burnType === 'max' && fromToken === 'FUSD') {
                const _tx = await collateralSystem.burnAndUnstakeMax(
                    expandTo18Decimals(burnAmount), // burnAmount
                    ethers.utils.formatBytes32String(toToken!), // unstakeCurrency
                );
                message.info(
                    'Burn _tx sent out successfully. Pls wait for a while......',
                );
                const receipt = await _tx.wait();
                console.log(receipt);
            } else {
                if (fromToken === 'FUSD') {
                    const _tx = await collateralSystem.burnAndUnstake(
                        expandTo18Decimals(burnAmount), // burnAmount
                        ethers.utils.formatBytes32String(toToken!), // unstakeCurrency
                        expandTo18Decimals(unstakeAmount), // unstakeAmount
                    );
                    message.info(
                        'Burn tx sent out successfully. Pls wait for a while......',
                    );
                    const receipt = await _tx.wait();
                    console.log(receipt);
                } else {
                    const tx = await collateralSystem.burnNonFUSDAndUnstake(
                        ethers.utils.formatBytes32String(fromToken), // burnCurrency
                        expandTo18Decimals(burnAmount), // burnAmount
                        ethers.utils.formatBytes32String(toToken), // unstakeCurrency
                        expandTo18Decimals(unstakeAmount), // unstakeAmount.
                    );
                    message.info(
                        'Burn tx sent out successfully. Pls wait for the settle.....',
                    );
                    const receipt = await tx.wait();
                    console.log(receipt);
                }
            }

            setSubmitting(false);
            onSubmitSuccess();
            //更新dataView
            clearDataView();
        } catch (err) {
            setSubmitting(false);
            console.log(err);
        } finally {
            setShowTxConfirm(false);
        }
    };

    return (
        <div className="common-box form-view">
            <ScaleGroup value={scale} updateScale={(scale) => setScale(scale)}>
                {[
                    {
                        label: intl.formatMessage({ id: 'burn.initial' }),
                        value: 'initial',
                        disabled: !burnInitialAvailable,
                        onClick: (scale) => burnInitialHandler(scale),
                    },
                    {
                        label: intl.formatMessage({ id: 'burn.max' }),
                        value: 'max',
                        disabled: !burnMaxAvailable,
                        onClick: (scale) => burnMaxHandler(scale),
                    },
                ].map((option) => (
                    <ScaleOption
                        key={option.label}
                        value={option.value}
                        disabled={option.disabled}
                        onClick={option.onClick}
                    >
                        <span>{option.label}</span>
                    </ScaleOption>
                ))}
            </ScaleGroup>
            <div className="input-item from-input">
                <p className="label">
                    {intl.formatMessage({ id: 'burn.from' })}
                </p>
                <div className="from-content input-item-content">
                    <div className="content-label">
                        <p className="left">
                            {intl.formatMessage({ id: 'burn.burned' })}
                        </p>
                        <p className="right">
                            {intl.formatMessage({ id: 'balance:' })}
                            <span className="balance">{fromTokenBalance}</span>
                        </p>
                    </div>
                    <div className="input">
                        <InputNumber
                            value={burnAmount}
                            onChange={burnAmountHandler}
                            placeholder="0.00"
                            className="custom-input"
                            type="number"
                            min={0}
                            max={selectedDebtInUSD || 9999999}
                        />
                        <div className="ftoken">
                            <button
                                className="max"
                                onClick={() =>
                                    burnAmountHandler(fromTokenBalance)
                                }
                            >
                                Max
                            </button>
                            <div className="token">
                                <TokenIcon
                                    name={fromToken.toLowerCase()}
                                    size={24}
                                />
                                <SelectTokens
                                    value={fromToken}
                                    tokenList={MINT_TOKENS.map((item) => ({
                                        name: item,
                                    }))}
                                    onSelect={fromTokenHandler}
                                ></SelectTokens>
                            </div>
                        </div>
                    </div>
                </div>
                <span className="debt">
                    {intl.formatMessage({ id: 'burn.debt:' })}{' '}
                    {toTokenDebtInUsd}
                </span>
            </div>
            <div className="input-item" style={{ zIndex: 2 }}>
                <p className="label">{intl.formatMessage({ id: 'burn.to' })}</p>
                <div className="to-content input-item-content">
                    <div className="content-label">
                        <p className="left">
                            {intl.formatMessage({ id: 'burn.unstaking' })}
                        </p>
                        <p className="right">
                            {intl.formatMessage({ id: 'balance:' })}
                            <span className="balance">{toTokenDebt}</span>
                        </p>
                    </div>
                    <div className="input">
                        <InputNumber
                            value={unstakeAmount}
                            onChange={unstakeAmountHandler}
                            placeholder="0.00"
                            className="custom-input"
                            type="number"
                            disabled={!toToken}
                            min={0}
                            max={toTokenDebt}
                        />
                        <div className="token">
                            <TokenIcon name={toToken.toLowerCase()} size={24} />
                            <SelectTokens
                                value={toToken}
                                tokenList={COLLATERAL_TOKENS}
                                onSelect={toTokenHandler}
                            ></SelectTokens>
                        </div>
                    </div>
                </div>
            </div>
            <div className="btn-burn">
                {fromToken !== 'FUSD' && !isApproved && (
                    <Button
                        className="btn-mint common-btn common-btn-red"
                        onClick={handleApprove}
                        loading={requestedApproval}
                    >
                        {intl.formatMessage({ id: 'burn.approve' })}
                    </Button>
                )}
                {(fromToken == 'FUSD' || isApproved) && (
                    <Button
                        loading={submitting}
                        className="btn-mint common-btn common-btn-red"
                        onClick={onSubmit}
                    >
                        {intl.formatMessage({ id: 'burn.burn' })}
                    </Button>
                )}
            </div>

            <TransitionConfirm
                visable={showTxConfirm}
                onClose={() => setShowTxConfirm(false)}
                dataSource={
                    tx && [
                        {
                            label: 'Burn',
                            direct: 'from',
                            value: {
                                token: tx.from.token,
                                amount: tx.from.amount,
                                mappingPrice: tx.from.price,
                            },
                        },
                        {
                            label: 'Unstaking',
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
