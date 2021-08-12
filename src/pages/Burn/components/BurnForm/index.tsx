import React, { useState, useEffect, useCallback } from 'react';
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
import { debounce } from 'lodash';
import ScaleGroup from '@/components/ScaleGroup';
import SelectTokens from '@/components/SelectTokens';

const TO_TOKENS = ['BTC'];
interface IProps {
    onSubmitSuccess: () => void;
}
export default (props: IProps) => {
    const { onSubmitSuccess } = props;
    const [debtBalance, setDebtBalance] = useState(0.0);
    const [burnAmount, setBurnAmount] = useState<number>();
    const [unstakeAmount, setUnstakeAmount] = useState<number>();
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

    const { balance: fusdBalance } = useBep20Balance('FUSD');

    const collateralSystem = useCollateralSystem();
    const prices = usePrices();
    const { account } = useWeb3React();

    const getTokenPrice = async (token: string) => {
        const res = await prices.getPrice(
            ethers.utils.formatBytes32String(token),
        );
        return parseFloat(ethers.utils.formatEther(res));
    };

    const burnAmountHandler = debounce(async (v) => {
        setBurnAmount(v);
        setDebtData({
            ...debtData,
            endValue: debtData.startValue - v,
        });
        if (toToken) {
            const toTokenPrice = await getTokenPrice(toToken);
            const val = parseFloat(
                toFixedWithoutRound((v * initialRatio) / toTokenPrice, 2),
            );
            setUnstakeAmount(val);
            setStakedData({
                ...stakedData,
                endValue: stakedData.startValue - val * toTokenPrice,
            });
            const ratio =
                debtData.startValue - v > 0
                    ? toFixedWithoutRound(
                          ((stakedData.startValue - val * toTokenPrice) /
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
            const val = parseFloat(
                toFixedWithoutRound((v * toTokenPrice) / initialRatio, 2),
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

    useEffect(() => {
        const debt = selectedDebtItemInfos.find(
            (item) => item.collateralToken === toToken,
        );
        if (debt) {
            setToTokenDebt(debt.debt);
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
            if (fusdBalance > selectedDebtInUSD) {
                // 不能直接burn max。
            } else {
                // 可以直接burn max
            }
        }
    }, [toToken, currencyRatio, initialRatio]);

    // 计算burned 和unstaking amount
    //TODO 替换 collateralSystem.getUserCollateralInUsd 方法。还没部署。
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
        const burnAmount =
            toTokenDebtInUsd -
            userCollateralInUsd.dividedBy(initialRatio).toNumber();
        setBurnAmount(burnAmount);
        setDebtData({
            ...debtData,
            endValue: debtData.startValue - burnAmount,
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
        if (fusdBalance < toTokenDebtInUsd) {
            message.warning(
                '钱包余额不足。请到dex购买fUSD，保证余额大于您的债务',
                5,
            );
            return;
        } else {
            setUnstakeAmount(toTokenDebt);
            const price = await prices.getPrice(
                ethers.utils.formatBytes32String(toToken),
            );
            const userCollateralInUsd = new BigNumber(toTokenDebt).multipliedBy(
                ethers.utils.formatEther(price),
            );
            const burnAmount = parseFloat(
                userCollateralInUsd.dividedBy(currencyRatio).toFixed(2),
            );
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
                const tx = await collateralSystem.burnAndUnstakeMax(
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
            //更新dataView
            clearDataView();
        } catch (err) {
            setSubmitting(false);
            console.log(err);
        }
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
                tokenList={COLLATERAL_TOKENS}
                onSelect={toTokenHandler}
                onClose={_closeHandler}
            >
                <button className="btn-mint-form" onClick={_showHandler}>
                    <span>{toToken || <DefaultView />}</span>
                    <i className="icon-down size-20"></i>
                </button>
            </SelectTokens>
        );
    };

    // const SearchDebts = () => {
    //     return (
    //         <div className="search-debts">
    //             <div className="search-input-wrapper">
    //                 <input type="text" placeholder="Search name or your debt" />
    //             </div>
    //             <button className="search-btn" />
    //         </div>
    //     );
    // };

    // useEffect(() => {
    //     switch (scale) {
    //         case 'initial': {
    //             burnInitialHandler(scale);
    //             break;
    //         }
    //         case 'max': {
    //             burnMaxHandler(scale);
    //             break;
    //         }
    //         default:
    //     }
    // }, [scale]);

    return (
        <div className="common-box form-view">
            {/* <SearchDebts /> */}
            <ScaleGroup
                scaleRange={[
                    {
                        label: 'Burn to initial',
                        value: 'initial',
                        disabled: !burnInitialAvailable,
                        onClick: (scale) => burnInitialHandler(scale),
                    },
                    {
                        label: 'Burn Max',
                        value: 'max',
                        disabled: !burnMaxAvailable,
                        onClick: (scale) => burnMaxHandler(scale),
                    },
                ]}
                value={scale}
                updateScale={(scale) => setScale(scale)}
            />
            <div className="input-item from-input">
                <p className="label">From</p>
                <div className="from-content input-item-content">
                    <div className="content-label">
                        <p className="left">Burned</p>
                        <p className="right">
                            Balance:{' '}
                            <span className="balance">{fusdBalance}</span>
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
                        <div className="ftoken">
                            <button className="max">Max</button>
                            <i className="icon-token usd">USD</i>
                            <span>fUSD</span>
                        </div>
                    </div>
                </div>
                <span className="debt">Debt : {'0.00'}</span>
            </div>
            <div className="input-item" style={{ zIndex: 2 }}>
                <p className="label">To</p>
                <div className="to-content input-item-content">
                    <div className="content-label">
                        <p className="left">Unstaking</p>
                        <p className="right">-</p>
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
                            <SelectToTokensView />
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="burn-type">
                <p className="tips">You can also choose</p>
                <div className="btns">
                    <Radio.Group
                        value={burnType}
                        onChange={(e) => setBurnType(e.target.value)}
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
            </div> */}
            <div className="btn-burn">
                <Button
                    loading={submitting}
                    className="btn-mint common-btn common-btn-red"
                    onClick={onSubmit}
                >
                    Burn
                </Button>
            </div>
        </div>
    );
};
