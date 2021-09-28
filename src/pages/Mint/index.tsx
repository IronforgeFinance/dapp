import './pc.less';
import './mobile.less';

import React, {
    useState,
    useEffect,
    useMemo,
    useContext,
    useRef,
    Fragment,
} from 'react';
import { InputNumber, Select, Progress, Button, Popover, Slider } from 'antd';
import * as message from '@/components/Notification';
import { request, useIntl, useModel } from 'umi';
import IconDown from '@/assets/images/down.svg';
import IconAdd from '@/assets/images/add.svg';
import { COLLATERAL_TOKENS, MINT_TOKENS, PLATFORM_TOKEN } from '@/config';
import { useERC20 } from '@/hooks/useContract';
import useTokenBalance, { useBep20Balance } from '@/hooks/useTokenBalance';
import { useWeb3React } from '@web3-react/core';
import { getBep20Contract } from '@/utils/contractHelper';
import {
    useCollateralSystem,
    usePrices,
    useExchangeSystem,
    useConfig,
} from '@/hooks/useContract';
import Tokens from '@/config/constants/tokens';
import Contracts from '@/config/constants/contracts';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import DataView from './components/DataView';
import { debounce } from 'lodash';
import {
    useCheckERC20ApprovalStatus,
    useERC20Approve,
} from '@/hooks/useApprove';
import { useInitialRatio } from '@/hooks/useConfig';
import useProvider from '@/hooks/useWeb3Provider';
import {
    toFixedWithoutRound,
    expandToNDecimals,
    expandTo18Decimals,
    ethersToBigNumber,
} from '@/utils/bigNumber';
import useDataView from '@/hooks/useDataView';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import Scale from '@/components/Scale';
// import SettingView from './SettingView';
import classNames from 'classnames';
import { useTokenSelector } from '@/components/TokenSelector';
import { TransitionConfirmContext } from '@/components/TransactionConfirm';
import CommentaryCard from '@/components/CommentaryCard';
import { useCallback } from 'react';
import { handleTxSent, isDeliveryAsset } from '@/utils';
// import Popover from '@/components/Popover';
import { TokenIcon } from '@/components/Icon';
import { StatusType } from '@/components/ProgressBar';
import { useNpcDialog } from '@/components/NpcDialog';
import { getTokenPrice } from '@/utils';
import useEnv from '@/hooks/useEnv';
import RatioSlider from './components/RatioSlider';

const RATIO_MAX_MINT = 800;

export default () => {
    const intl = useIntl();
    const { isMobile } = useEnv();
    const { setWords } = useNpcDialog();
    const { account } = useWeb3React();
    const provider = useProvider();
    const currentStakedValue = useRef(0);
    const [collateralAmount, setCollateralAmount] = useState<
        undefined | number
    >();
    const { open } = useTokenSelector();
    const { open: openConfirmModal } = useContext(TransitionConfirmContext);
    const [lockedAmount, setLockedAmount] = useState<undefined | number>();
    const [toAmount, setToAmount] = useState<undefined | number>();
    // const [collateralBalance, setCollateralBalance] = useState('0.00');
    const [collateralToken, setCollateralToken] = useState(
        COLLATERAL_TOKENS[0].name,
    );
    // const [fTokenBalance, setFTokenBalance] = useState('0.00')
    const [toToken, setToToken] = useState(MINT_TOKENS[0]);
    const [submitting, setSubmitting] = useState(false);
    const [computedRatio, setComputedRatio] = useState(0);
    const [lockedScale, setLockedScale] = useState<string | number | null>(
        null,
    );
    const [sliderRatio, setSliderRatio] = useState(0);
    const _fTokenBalance = useRef(0);

    const collateralSystem = useCollateralSystem();
    const exchangeSystem = useExchangeSystem();
    const configContract = useConfig();

    const initialRatio = useInitialRatio(collateralToken);

    const collateralTokenAddress = useMemo(() => {
        if (collateralToken) {
            return Tokens[collateralToken].address[process.env.APP_CHAIN_ID!];
        }
        return '';
    }, [collateralToken]);
    const collateralSytemContract =
        Contracts.CollateralSystem[process.env.APP_CHAIN_ID!];
    const { isApproved, setLastUpdated } = useCheckERC20ApprovalStatus(
        collateralTokenAddress,
        collateralSytemContract,
    );

    const { isApproved: isIFTApproved, setLastUpdated: setLastIFTApproved } =
        useCheckERC20ApprovalStatus(
            Tokens.IFT.address[process.env.APP_CHAIN_ID],
            collateralSytemContract,
        );

    const { currencyRatio } = useDataView(collateralToken);

    const { handleApprove, requestedApproval } = useERC20Approve(
        collateralTokenAddress,
        collateralSytemContract,
        setLastUpdated,
    );

    const {
        handleApprove: handleIFTApprove,
        requestedApproval: requestIFTApproval,
    } = useERC20Approve(
        Tokens.IFT.address[process.env.APP_CHAIN_ID],
        collateralSytemContract,
        setLastIFTApproved,
    );

    const handleAllApprove = () => {
        if (!isApproved && collateralToken) {
            handleApprove();
            return; // 一次按钮点击处理一次approve
        }
        if (!isIFTApproved) {
            handleIFTApprove();
            return;
        }
    };

    // const { stakedData, setStakedData } = useStakedData();

    const openCollateralTokenList = useCallback(() => {
        setWords(collateralToken ? 'collateralToken' : '');
        open(COLLATERAL_TOKENS, { callback: collateralTokenHandler });
    }, []);
    const openToTokenList = useCallback(() => {
        setWords(toToken ? intl.formatMessage({ id: 'npc.mintAssets' }) : '');
        open(
            MINT_TOKENS.map((name) => ({ name })),
            { callback: toTokenHandler },
        );
    }, []);

    const {
        stakedData,
        setStakedData,
        lockedData,
        setLockedData,
        debtData,
        setDebtData,
        fRatioData,
        setfRatioData,
    } = useModel('dataView', (model) => ({
        ...model,
    }));

    const { requestConnectWallet } = useModel('app', (model) => ({
        requestConnectWallet: model.requestConnectWallet,
    }));

    const { balance: fTokenBalance, refresh: refreshIFTBalance } =
        useBep20Balance(PLATFORM_TOKEN);
    console.log('fTokenBalance: ', fTokenBalance);
    useBep20Balance('IFT');
    _fTokenBalance.current = fTokenBalance;

    const { balance: collateralBalance, refresh: refreshCollateralBalance } =
        useBep20Balance(collateralToken, 6);

    const { balance: mintBalance, refresh: refreshMintBalance } =
        useBep20Balance(toToken, 6);

    const refreshBalance = () => {
        refreshIFTBalance();
        refreshCollateralBalance();
        refreshMintBalance();
    };

    useEffect(() => {
        (async () => {
            let newRatio = currencyRatio;
            if (
                account &&
                collateralToken &&
                collateralAmount &&
                lockedAmount
            ) {
                const _buildRatio = await collateralSystem.calcBuildRatio(
                    account,
                    ethers.utils.formatBytes32String(collateralToken), // stake currency
                    expandTo18Decimals(collateralAmount), //stake amount
                    expandTo18Decimals(lockedAmount), // locked amount
                );
                const buildRatio = parseFloat(
                    ethers.utils.formatEther(_buildRatio),
                );

                console.log('calcBuildRatio: ', buildRatio);
                newRatio = toFixedWithoutRound(1 / buildRatio, 4);
            } else {
                newRatio = initialRatio;
            }
            const _endValue = parseFloat((newRatio * 100).toFixed(4));
            setfRatioData({
                ...fRatioData,
                startValue: fRatioData.startValue || _endValue,
                endValue: _endValue,
            });
            setComputedRatio(newRatio);
            setSliderRatio(newRatio);
        })();
    }, [
        collateralAmount,
        collateralToken,
        lockedAmount,
        account,
        initialRatio,
    ]);

    // 计算toAmount
    useEffect(() => {
        debounce(async () => {
            let maxCanbuild;
            if (account && toToken && collateralAmount) {
                //TODO 该接口需要有用户地址，否则报错
                const res = await collateralSystem.getMaxBuildAmount(
                    ethers.utils.formatBytes32String(collateralToken),
                    expandTo18Decimals(collateralAmount),
                    ethers.utils.formatBytes32String(toToken),
                    expandTo18Decimals(lockedAmount || 0),
                );
                maxCanbuild = parseFloat(ethers.utils.formatEther(res));
            } else {
                const fromPrice = await getTokenPrice(collateralToken);
                const toPrice = await getTokenPrice(toToken);
                maxCanbuild =
                    (fromPrice * collateralAmount) / (toPrice * initialRatio);
            }
            if (maxCanbuild) {
                setToAmount(toFixedWithoutRound(maxCanbuild, 6));
            }
        }, 500)();
    }, [
        collateralToken,
        collateralAmount,
        lockedAmount,
        computedRatio,
        toToken,
        account,
    ]);

    /**@description 弹出npc */
    useEffect(
        () => setWords(intl.formatMessage({ id: 'npc.mintRatio' })),
        [lockedScale],
    );
    useEffect(() => {
        return () => {
            setWords('');
        };
    }, []);

    // 计算新的债务
    useEffect(() => {
        (async () => {
            if (toToken && toAmount) {
                const toTokenPrice = await getTokenPrice(toToken);
                const val = parseFloat(
                    new BigNumber(toAmount)
                        .multipliedBy(toTokenPrice)
                        .plus(debtData.startValue)
                        .toFixed(2),
                );
                setDebtData({
                    ...debtData,
                    endValue: val,
                });
            } else {
                setDebtData({
                    ...debtData,
                    endValue: debtData.startValue,
                });
            }
        })();
    }, [toToken, toAmount]);
    const collateralAmountHandler = useCallback(
        debounce(async (v) => {
            setCollateralAmount(v);
            const price = await getTokenPrice(collateralToken);

            /**@type {number} 质押价值 */
            const currentStakeValue = Number(v) * price + stakedData.startValue;
            setStakedData({
                ...stakedData,
                endValue: currentStakeValue,
            });

            currentStakedValue.current = Number(v) * price;
            scaleHandler(lockedScale);
        }, 500),
        [stakedData, lockedScale],
    );

    const lockedAmountHandler = React.useCallback(
        debounce(async (v) => {
            // TODO comment this for test
            // if (Number(v) > maxLockedAmount) {
            //     setLockedAmount(0);
            //     message.warning('锁仓价值不能超过质押价值的3/10');
            //     return;
            // }
            setLockedAmount(v);
            // setLockedScale(Number(v) / fTokenBalance);
            const bsPrice = await getTokenPrice(PLATFORM_TOKEN);
            const val = toFixedWithoutRound(bsPrice * v, 2);
            setLockedData({
                ...lockedData,
                endValue: val + lockedData.startValue,
            });
        }, 500),
        [lockedData],
    );

    const scaleHandler = useCallback(
        debounce(async (v) => {
            if (v == undefined) return;

            setLockedScale(+v);
            const bsPrice = await getTokenPrice(PLATFORM_TOKEN);
            console.log('>> bsp: %s', bsPrice);

            /**@description 计算公式：(锁定比例 * 质押价值) / BSP */
            let amount = (currentStakedValue.current * Number(v)) / bsPrice;
            console.log('>> stake total value: %s', amount);

            /**@description 超过余额的计算 */
            amount =
                amount < _fTokenBalance.current && _fTokenBalance.current > 0
                    ? amount
                    : _fTokenBalance.current;
            setLockedAmount(toFixedWithoutRound(amount, 6));

            const val = toFixedWithoutRound(bsPrice * amount, 2);
            setLockedData({
                ...lockedData,
                endValue: val || 0,
            });
        }),
        [currentStakedValue],
    );

    const toAmountHandler = (v) => {
        setToAmount(v);
    };

    const sliderRatioHandler = async (v) => {
        const ratio = v / 10;
        setSliderRatio(ratio);
        if (collateralToken && collateralAmount && ratio > 0) {
            const price = await getTokenPrice(toToken);
            const amount = currentStakedValue.current / ratio / price;
            setToAmount(amount);
        } else if (ratio === 0) {
            setToAmount(0);
        }
    };

    const collateralTokenHandler = (v) => {
        setCollateralToken(v);
        setCollateralAmount(0);
        setToAmount(0);
    };

    const toTokenHandler = (v, remainDays) => {
        if (remainDays !== undefined && remainDays <= 0) {
            message.info(
                `The price of ${v} is expired. Pls select other tokens.`,
            );
            return;
        }
        setToToken(v);
        setToAmount(0);
    };

    const onSubmit = async () => {
        if (!account) {
            message.warning('Pls connect wallet first');
            return;
        }
        if (!collateralAmount || !toAmount) {
            message.warning('Collateral amount and to amount are required');
            return;
        }
        const maxCanBuild = await collateralSystem.getMaxBuildAmount(
            ethers.utils.formatBytes32String(collateralToken),
            expandTo18Decimals(collateralAmount),
            ethers.utils.formatBytes32String(toToken),
            expandTo18Decimals(lockedAmount || 0),
        );
        const maxAmount = toFixedWithoutRound(
            ethers.utils.formatEther(maxCanBuild),
            6,
        );
        if (toAmount > maxAmount) {
            message.warning(
                'Build amount is too big. You need more collateral',
            );
            return;
        }
        if (isApproved && isIFTApproved) {
            try {
                setSubmitting(true);
                let tx;
                if (toToken !== 'FUSD') {
                    tx = await collateralSystem.stakeAndBuildNonFUSD(
                        ethers.utils.formatBytes32String(collateralToken), // stakeCurrency
                        expandTo18Decimals(collateralAmount), // stakeAmount
                        ethers.utils.formatBytes32String(toToken), // buildToken
                        expandTo18Decimals(toAmount), // buildAmount
                        expandTo18Decimals(lockedAmount || 0),
                    );
                } else {
                    tx = await collateralSystem.stakeAndBuild(
                        ethers.utils.formatBytes32String(collateralToken), // stakeCurrency
                        expandTo18Decimals(collateralAmount!), // stakeAmount
                        expandTo18Decimals(toAmount!), // buildAmount
                        expandTo18Decimals(lockedAmount || 0),
                    );
                }
                await handleTxSent(tx, intl);
                // message.success({
                //     message: intl.formatMessage({ id: 'txSent' }),
                //     description: intl.formatMessage({
                //         id: 'txSentSuccess',
                //     }),
                //     scanHref: `${process.env.BSC_SCAN_URL}/tx/${tx.hash}`,
                // });
                // const receipt1 = await tx.wait();
                // console.log(receipt1);

                // // fetchCollateralBalance();
                // message.success({
                //     message: intl.formatMessage({ id: 'txReceived' }),
                //     description: intl.formatMessage({
                //         id: 'txReceivedSuccess',
                //     }),
                //     scanHref: `${process.env.BSC_SCAN_URL}/tx/${tx.hash}`,
                // });
                refreshBalance();
                setSubmitting(false);
            } catch (err) {
                console.log(err);
                if (err && err.code === 4001) {
                    message.error({
                        message: intl.formatMessage({ id: 'txRejected' }),
                        description: intl.formatMessage({
                            id: 'rejectedByUser',
                        }),
                    });
                    return;
                }
            }
        }
    };

    /**@description 交易前的确认 */
    const openMintConfirm = async () => {
        setSubmitting(true);
        if (sliderRatio && sliderRatio < computedRatio) {
            message.warning('F-ratio is too low. Can not mint now.');
            return setSubmitting(false);
        }
        if (!account) {
            message.warning('Pls connect wallet first');
            return setSubmitting(false);
        }
        if (!collateralAmount || !toAmount) {
            message.warning('Collateral amount and to amount are required');
            return setSubmitting(false);
        }
        const collateralTokenPrice = await getTokenPrice(collateralToken);
        const toTokenPrice = await getTokenPrice(toToken);
        const lockedPrice = await getTokenPrice(PLATFORM_TOKEN); // TODO change name
        const _lockedAmount = lockedAmount || 0;
        console.log(
            '>> collateral price: ',
            (collateralAmount * collateralTokenPrice).toFixed(2),
        );
        console.log(
            '>> locked price: ',
            (lockedPrice * _lockedAmount).toFixed(2),
        );
        console.log(
            '>> fassets price: ',
            Number((toTokenPrice * toAmount).toFixed(2)),
        );

        openConfirmModal({
            view: 'mint',
            fromToken: {
                name: collateralToken,
                price: Number(
                    (collateralAmount * collateralTokenPrice).toFixed(2),
                ),
                amount: collateralAmount,
            },
            toToken: {
                name: toToken,
                price: Number((toTokenPrice * toAmount).toFixed(2)),
                amount: toAmount,
            },
            bsToken: {
                name: 'BS',
                price: Number((lockedPrice * _lockedAmount).toFixed(2)),
                amount: _lockedAmount,
            },
            type: isDeliveryAsset(toToken) ? 'Delivery' : 'Perpetuation',
            confirm: onSubmit,
            final: () => setSubmitting(false),
        });
    };

    // /**@type 质押率进度百分比 */
    // const sliderRatio = useMemo(() => {
    //     const ratio = ((computedRatio * 100) / RATIO_MAX_MINT) * 100;
    //     console.log('>> slider ratio is %s', ratio);

    //     return ratio;
    // }, [computedRatio]);

    return (
        <Fragment>
            {!isMobile && <DataView />}
            <div className="right-box">
                {!isMobile && (
                    <CommentaryCard
                        title={intl.formatMessage({ id: 'mint.title' })}
                        description={
                            '用户可以通过单币质押或是组合质押来铸造合成资产'
                        }
                    />
                )}
                <div className="mint-form-box common-box">
                    <div className="input-item">
                        <p className="label">
                            {intl.formatMessage({ id: 'mint.from' })}
                        </p>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left">
                                    {intl.formatMessage({
                                        id: 'mint.collateral',
                                    })}
                                </p>
                                <p className="right">
                                    {intl.formatMessage({ id: 'balance:' })}{' '}
                                    <span className="balance">
                                        {account ? collateralBalance : '-'}
                                    </span>
                                </p>
                            </div>
                            <div className="input">
                                <InputNumber
                                    value={collateralAmount}
                                    onChange={collateralAmountHandler}
                                    placeholder="0.00"
                                    type="number"
                                    className={classNames({
                                        'custom-input': true,
                                        disabled: !isApproved,
                                    })}
                                />
                                <div className="token">
                                    <TokenIcon
                                        name={collateralToken}
                                        size={24}
                                    />
                                    <Button
                                        className="select-token-btn"
                                        onClick={openCollateralTokenList}
                                    >
                                        {collateralToken}
                                        <i className="icon-down size-24" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <img src={IconAdd} alt="" className="icon-add" />

                    <div className="input-item">
                        <div className="label">
                            {intl.formatMessage({ id: 'mint.locked' })}
                            <Popover
                                content={'选择质押物中BS的比例'}
                                trigger="hover"
                                placement="topLeft"
                            >
                                <i
                                    className={`icon-question size-${
                                        isMobile ? 24 : 16
                                    }`}
                                />
                            </Popover>
                        </div>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left">
                                    <TokenIcon
                                        name="bs"
                                        style={{ marginRight: 6 }}
                                    />
                                    {intl.formatMessage({ id: 'mint.ftoken' })}
                                </p>
                                <p className="right">
                                    {intl.formatMessage({ id: 'balance:' })}
                                    <span className="balance">
                                        {account ? fTokenBalance : '-'}
                                    </span>
                                </p>
                            </div>
                            <div className="input mint-locked-input">
                                <InputNumber
                                    value={lockedAmount}
                                    onChange={lockedAmountHandler}
                                    placeholder="0.00"
                                    className="custom-input"
                                    type="number"
                                />
                                <Scale.Group
                                    value={lockedScale}
                                    updateScale={scaleHandler}
                                >
                                    {[
                                        { label: '0', value: 0 },
                                        { label: '1/10', value: 0.1 },
                                        { label: '1/5', value: 0.2 },
                                        { label: '3/10', value: 0.3 },
                                    ].map((option) => (
                                        <Scale.Option
                                            key={option.label}
                                            value={option.value}
                                        >
                                            <span>{option.label}</span>
                                        </Scale.Option>
                                    ))}
                                </Scale.Group>
                            </div>
                        </div>
                    </div>
                    <i className="icon-arrow-down" />
                    <div className="input-item">
                        <p className="label">
                            {intl.formatMessage({ id: 'mint.to' })}
                        </p>
                        <div className="input-item-content">
                            <div className="content-label">
                                <p className="left">
                                    {intl.formatMessage({ id: 'mint.fassets' })}
                                </p>
                                <p className="right">
                                    {intl.formatMessage({ id: 'balance:' })}
                                    <span className="balance">
                                        {account ? mintBalance : '-'}
                                    </span>
                                </p>
                            </div>
                            <div className="input">
                                <InputNumber
                                    type="number"
                                    value={toAmount}
                                    placeholder="0.00"
                                    className={classNames({
                                        'custom-input': true,
                                        disabled: !isApproved,
                                    })}
                                    onChange={toAmountHandler}
                                />
                                <div className="token">
                                    <TokenIcon
                                        name={String(toToken).toLowerCase()}
                                        size={24}
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

                    <RatioSlider
                        value={sliderRatio * 10}
                        onChange={sliderRatioHandler}
                        safeRatio={computedRatio * 10}
                    />
                    {!account && (
                        <Button
                            className="btn-mint common-btn common-btn-yellow"
                            onClick={() => {
                                requestConnectWallet();
                            }}
                        >
                            {intl.formatMessage({ id: 'app.unlockWallet' })}
                        </Button>
                    )}
                    {account && isApproved && isIFTApproved && (
                        <Button
                            className="btn-mint common-btn common-btn-red"
                            onClick={openMintConfirm}
                            loading={submitting}
                        >
                            {intl.formatMessage({ id: 'mint.cast' })}
                        </Button>
                    )}
                    {account &&
                        ((!isApproved && collateralToken) ||
                            !isIFTApproved) && (
                            <Button
                                className="btn-mint common-btn common-btn-red"
                                onClick={handleAllApprove}
                                loading={
                                    requestedApproval || requestIFTApproval
                                }
                            >
                                {intl.formatMessage({ id: 'mint.approve' })}
                            </Button>
                        )}
                    {isMobile && <span className="fee-cost">Fee cost: 0</span>}
                </div>
            </div>
            {isMobile && <DataView />}
        </Fragment>
    );
};
