import './pc.less';
import './mobile.less';

import { useState, useEffect, useCallback, useContext } from 'react';
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
import { handleTxSent, isDeliveryAsset } from '@/utils';
import { TokenIcon } from '@/components/Icon';
import { useIntl } from 'umi';
import { getTokenPrice } from '@/utils';
import {
    useCheckERC20ApprovalStatus,
    useERC20Approve,
} from '@/hooks/useApprove';
import Contracts from '@/config/constants/contracts';
import { useTokenSelector } from '@/components/TokenSelector';
import { TransitionConfirmContext as TransactionConfirmContext } from '@/components/TransactionConfirm';
import { useMyDebts } from '@/components/MyDebts';
import { BSCSCAN_EXPLORER } from '@/config/constants/constant';
import { useNpcDialog } from '@/components/NpcDialog';

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
    const [burnInitialAvailable, setBurnInitialAvailable] = useState(true);
    const [burnMaxAvailable, setBurnMaxAvailable] = useState(false);
    const { open } = useTokenSelector();
    const { open: openConfirmModal } = useContext(TransactionConfirmContext);
    const { open: checkoutMyDebts } = useMyDebts();
    const { setWords: say } = useNpcDialog();

    const { requestConnectWallet, collateralTokens, mintTokens } = useModel(
        'app',
        (model) => ({
            collateralTokens: model.collateralTokens,
            requestConnectWallet: model.requestConnectWallet,
            mintTokens: model.mintTokens,
        }),
    );

    const { currencyRatio } = useDataView(toToken);

    const { debt: toTokenDebtInUsd, setLastUpdated: setDebtUpdated } =
        useSelectedDebtInUSD(toToken);

    const initialRatio = useInitialRatio(toToken);

    const { debtItemInfos, totalDebtInUSD } = useModel('burnData', (model) => ({
        ...model,
    }));
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

    const openFromTokenList = useCallback(
        () =>
            open(
                MINT_TOKENS.map((item) => ({
                    name: item,
                })),
                { callback: fromTokenHandler },
            ),
        [],
    );
    const openToTokenList = useCallback(
        () => open(COLLATERAL_TOKENS, { callback: toTokenHandler }),
        [],
    );

    const collateralSystem = useCollateralSystem();
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
            // if (currencyRatio < initialRatio) {
            //     _unstakeAmount = 0;
            // } else {
            //     _unstakeAmount = toFixedWithoutRound(
            //         (v * fromTokenPrice * initialRatio) / toTokenPrice,
            //         2,
            //     );
            // }
            _unstakeAmount = toFixedWithoutRound(
                (v * fromTokenPrice * initialRatio) / toTokenPrice,
                2,
            );
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
        const debt = debtItemInfos.find(
            (item) => item.collateralToken === toToken,
        );
        if (debt) {
            setToTokenDebt(debt.collateral);
        }
    }, [toToken, debtItemInfos]);

    useEffect(() => {
        //
        if (!toToken) {
            setBurnInitialAvailable(false);
            setBurnMaxAvailable(false);
        } else {
            /*TODO 计算toToken的 ratio.
            钱包余额大于等于债务数，则可直接burn to max
            钱包余额小于债务数，用户执行一个burn to max操作，实际上进行两个合约步骤：
                1.直接用bnb进行债务购买来补充钱包不足的债务，
                2.购买后，钱包余额大于等于债务数，正常燃烧
            */
            // if (currencyRatio < initialRatio) {
            //     setBurnInitialAvailable(true);
            // } else {
            //     setBurnInitialAvailable(false);
            // }
            setBurnMaxAvailable(true);
            if (fromTokenBalance > totalDebtInUSD) {
                // 不能直接burn max。
            } else {
                // 可以直接burn max
            }
        }
    }, [toToken, currencyRatio, initialRatio]);

    // 计算burned 和unstaking amount
    const burnInitialHandler = async (v) => {
        setBurnType(v);

        say(intl.formatMessage({ id: 'butnToInitialTip' }));

        if (currencyRatio < initialRatio) {
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
            if (fromToken !== 'FUSD') {
                const tokenPrice = await getTokenPrice(fromToken);
                burnAmount = parseFloat(
                    new BigNumber(burnFUSDAmount)
                        .dividedBy(tokenPrice)
                        .toFixed(6),
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
        } else {
            // 抵押率过高，可以解绑一些抵押物
            setBurnAmount(0);
            const debtInfo = debtItemInfos.find(
                (item) => item.collateralToken === toToken,
            );
            const toTokenPrice = await getTokenPrice(toToken);
            const unstakeAmount =
                debtInfo.collateral -
                (toTokenDebtInUsd * initialRatio) / toTokenPrice;

            if (unstakeAmount < 0) {
                return;
            }
            setUnstakeAmount(unstakeAmount);
            setStakedData({
                ...stakedData,
                endValue: stakedData.startValue - unstakeAmount * toTokenPrice,
            });
            setfRatioData({
                ...fRatioData,
                endValue: initialRatio * 100,
            });
            setLockedData({
                ...lockedData,
                endValue: lockedData.startValue,
            });
        }
    };

    /* 如果余额小于债务 提示进行两个交易，tx1用账户里bnb去购买fusd，tx2进行unstake
    合约暂时不支持这样的两步操作。所以页面上就提示用户需要购买fusd，保证账户余额大于债务。
    */
    const burnMaxHandler = async (v) => {
        setBurnType(v);

        say(intl.formatMessage({ id: 'butnToMaxTip' }));

        const fromTokenPrice = await getTokenPrice(fromToken);
        if (fromTokenBalance * fromTokenPrice < toTokenDebtInUsd) {
            setBurnAmount(0);
            message.warning(
                '钱包余额不足。请到dex购买相应的fAsset，保证金额大于您的债务',
                5,
            );
            return;
        } else {
            setUnstakeAmount(toTokenDebt);
            const price = await getTokenPrice(fromToken);
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

    const onSubmit = async () => {
        try {
            setSubmitting(true);
            let tx;
            if (burnType === 'max' && fromToken === 'FUSD') {
                tx = await collateralSystem.burnAndUnstakeMax(
                    expandTo18Decimals(burnAmount), // burnAmount
                    ethers.utils.formatBytes32String(toToken!), // unstakeCurrency
                );
            } else {
                if (fromToken === 'FUSD') {
                    tx = await collateralSystem.burnAndUnstake(
                        expandTo18Decimals(burnAmount), // burnAmount
                        ethers.utils.formatBytes32String(toToken!), // unstakeCurrency
                        expandTo18Decimals(unstakeAmount), // unstakeAmount
                    );
                } else {
                    tx = await collateralSystem.burnNonFUSDAndUnstake(
                        ethers.utils.formatBytes32String(fromToken), // burnCurrency
                        expandTo18Decimals(burnAmount), // burnAmount
                        ethers.utils.formatBytes32String(toToken), // unstakeCurrency
                        expandTo18Decimals(unstakeAmount), // unstakeAmount.
                    );
                }
            }

            await handleTxSent(tx, intl);

            setSubmitting(false);
            setDebtUpdated();
            onSubmitSuccess();
            //更新dataView
            // clearDataView();
        } catch (err) {
            console.log(err);
            if (err && err.code === 4001) {
                message.error({
                    message: intl.formatMessage({ id: 'txRejected' }),
                    description: intl.formatMessage({ id: 'rejectedByUser' }),
                });
                return;
            }
        }
    };

    /**@description 交易前的确认 */
    const openBurnConfirm = useCallback(async () => {
        if (!burnAmount && !unstakeAmount) {
            message.warning('Burned amount and unstaking can not be both 0');
            return;
        }
        if (burnAmount > fromTokenBalance) {
            message.warning('Burned amount is greater than balance');
            return;
        }
        if (Number(burnAmount) > Number(totalDebtInUSD)) {
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
        // if (
        //     currencyRatio < initialRatio &&
        //     unstakeAmount > 0 &&
        //     burnType !== 'max'
        // ) {
        //     message.warning(
        //         '当前抵押率低于初始抵押率。不能解锁抵押物。请燃烧多余的债务后解锁。',
        //     );
        //     return;
        // }
        const debtInfo = debtItemInfos.find(
            (item) => item.collateralToken === toToken,
        );

        if (debtInfo && unstakeAmount > Number(debtInfo.collateral)) {
            message.error('Unstaking amount is greater than collateral amount');
            return;
        }

        const toTokenPrice = await getTokenPrice(toToken);
        const lockedPrice = await getTokenPrice(PLATFORM_TOKEN);
        const unlockedAmount = lockedData.startValue - lockedData.endValue;

        openConfirmModal({
            view: 'burn',
            fromToken: {
                name: fromToken,
                price: Number((fromTokenPrice * burnAmount).toFixed(2)),
                amount: burnAmount,
            },
            toToken: {
                name: toToken,
                price: Number((toTokenPrice * unstakeAmount).toFixed(2)),
                amount: unstakeAmount,
            },
            bsToken: {
                name: 'BS',
                price: Number((lockedPrice * unlockedAmount).toFixed(2)),
                amount: unlockedAmount,
            },
            type: isDeliveryAsset(toToken) ? 'Delivery' : 'Perpetuation',
            confirm: onSubmit,
            final: () => setSubmitting(false),
        });
    }, [toToken, unstakeAmount, burnAmount, lockedData, stakedData]);

    return (
        <div className="common-box form-view">
            <button className="checkout-debt-btn" onClick={checkoutMyDebts} />
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
                            max={totalDebtInUSD || 9999999}
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
                <span className="debt">
                    {intl.formatMessage({ id: 'burn.debt:' })}
                    {'$'}
                    {toTokenDebtInUsd}
                </span>
            </div>
            <i className="icon-arrow-down" />
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
            <div className="btn-burn">
                {account && fromToken !== 'FUSD' && !isApproved && (
                    <Button
                        className="btn-mint common-btn common-btn-red"
                        onClick={handleApprove}
                        loading={requestedApproval}
                    >
                        {intl.formatMessage({ id: 'burn.approve' })}
                    </Button>
                )}
                {!account && (
                    <Button
                        className="btn-mint common-btn common-btn-yellow"
                        onClick={() => requestConnectWallet()}
                    >
                        {intl.formatMessage({ id: 'app.unlockWallet' })}
                    </Button>
                )}
                {account && (fromToken == 'FUSD' || isApproved) && (
                    <Button
                        loading={submitting}
                        className="btn-mint common-btn common-btn-red"
                        onClick={openBurnConfirm}
                    >
                        {intl.formatMessage({ id: 'burn.burn' })}
                    </Button>
                )}
            </div>
        </div>
    );
};
