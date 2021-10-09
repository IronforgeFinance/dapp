import './pc.less';
import './mobile.less';

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { InputNumber, Select, Button } from 'antd';
import * as message from '@/components/Notification';
import { debounce } from 'lodash';
import { useModel, useIntl } from 'umi';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import { useRouter } from '@/hooks/useContract';
import { useWeb3React } from '@web3-react/core';
import { DEADLINE } from '@/config/constants/constant';
import Tokens from '@/config/constants/tokens';
import Contracts from '@/config/constants/contracts';
import { ethers } from 'ethers';
import {
    useCheckERC20ApprovalStatus,
    useERC20Approve,
} from '@/hooks/useApprove';
import { TokenIcon } from '@/components/Icon';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import { useTokenSelector } from '@/components/TokenSelector';
import { handleTxSent } from '@/utils';

export default () => {
    const intl = useIntl();
    const [lp, setLp] = useState<string>();
    const [lpAmount, setLpAmount] = useState<number>();
    const [receiveTokens, setReceiveTokens] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [showTxConfirm, setShowTxConfirm] = useState(false);
    const [tx, setTx] = useState<any | null>(null);
    const [showSelectFromToken, setShowSelectFromToken] = useState(false);
    const routerContract = useRouter();
    const { account } = useWeb3React();
    const { open } = useTokenSelector();

    const { lpDataList, lpDataToRemove } = useModel('lpData', (model) => ({
        ...model,
    }));

    const { requestConnectWallet } = useModel('app', (model) => ({
        requestConnectWallet: model.requestConnectWallet,
    }));

    const pancakeRouter = Contracts.PancakeRouter[process.env.APP_CHAIN_ID];

    const { isApproved, setLastUpdated } = useCheckERC20ApprovalStatus(
        lp ? Tokens[lp].address[process.env.APP_CHAIN_ID] : '',
        pancakeRouter,
    );

    const { handleApprove, requestedApproval } = useERC20Approve(
        lp ? Tokens[lp].address[process.env.APP_CHAIN_ID] : '',
        pancakeRouter,
        setLastUpdated,
    );

    const { balance, refresh: refreshBalance } = useBep20Balance(lp);

    const lpAmountHandler = (v) => {
        setLpAmount(v);
    };

    useEffect(() => {
        if (lpDataToRemove) {
            const lpAmount = lpDataToRemove.balance;
            const lp = lpDataToRemove.symbol;
            setLpAmount(lpAmount);
            setLp(lp);
        }
    }, [lpDataToRemove]);

    useEffect(() => {
        const handleReceiveTokens = debounce(() => {
            if (lp && lpAmount) {
                const lpData = lpDataList.find((item) => item.symbol === lp);
                if (lpData) {
                    const token1Amount = toFixedWithoutRound(
                        (lpAmount * lpData.token1Balance) / lpData.balance,
                        2,
                    );
                    const token2Amount = toFixedWithoutRound(
                        (lpAmount * lpData.token2Balance) / lpData.balance,
                        2,
                    );
                    setReceiveTokens([
                        {
                            token: lpData.token1,
                            amount: token1Amount,
                            price: lpData.token1Price,
                        },
                        {
                            token: lpData.token2,
                            amount: token2Amount,
                            price: lpData.token2Price,
                        },
                    ]);
                }
            }
        }, 500);
        handleReceiveTokens();
    }, [lpAmount, lp]);

    const selectOptions = React.useMemo(() => {
        return lpDataList.map((item) => ({
            name: item.symbol,
        }));
    }, [lpDataList]);

    const handleWithdraw = async () => {
        if (!account) {
            message.warning('Pls connect wallet');
            return;
        }
        if (!lpAmount || !lp) {
            message.warning('Pls fill in the blanks');
            return;
        }
        if (lpAmount > balance) {
            message.warning('Insufficient balance');
            return;
        }
        try {
            setSubmitting(true);
            setShowTxConfirm(true);
            setTx([
                {
                    label: 'LP',
                    value: {
                        token: lp,
                        amount: lpAmount,
                        mappingPrice: '--',
                    },
                },
                {
                    label: 'Token0',
                    value: {
                        token: receiveTokens[0].token,
                        amount: receiveTokens[0].amount,
                        mappingPrice: '--',
                    },
                },
                {
                    label: 'Token1',
                    value: {
                        token: receiveTokens[1].token,
                        amount: receiveTokens[1].amount,
                        mappingPrice: '--',
                    },
                },
            ]);

            const deadline = DEADLINE;
            const chainId = process.env.APP_CHAIN_ID;
            const token1 = receiveTokens[0].token;
            const token2 = receiveTokens[1].token;
            const token1Address = Tokens[token1].address[chainId];
            const token2Address = Tokens[token2].address[chainId];
            const tx = await routerContract.removeLiquidity(
                token1Address,
                token2Address,
                ethers.utils.parseEther(String(lpAmount)),
                0,
                0,
                account,
                deadline,
            );
            await handleTxSent(tx, intl);
            setSubmitting(false);
            message.success('Withdraw successfully. Pls check your balance.');
            //更新数据
            refreshBalance();
        } catch (err) {
            console.log(err);
            setSubmitting(false);
            if (err && err.code === 4001) {
                message.error({
                    message: intl.formatMessage({ id: 'txRejected' }),
                    description: intl.formatMessage({ id: 'rejectedByUser' }),
                });
                return;
            }
        } finally {
            setShowTxConfirm(false);
        }
    };

    const openLpTokenList = useCallback(
        () => open(selectOptions, { callback: (v) => setLp(v) }),
        [selectOptions],
    );

    return (
        <div>
            <div
                className="provide-form common-box"
                style={{ filter: 'unset' }}
            >
                <div className="input-item">
                    <p className="label">
                        {intl.formatMessage({ id: 'liquidity.withdraw.lp' })}
                    </p>
                    <div className="input-item-content">
                        <div className="content-label">
                            <p className="right">
                                {intl.formatMessage({
                                    id: 'balance:',
                                })}
                                <span className="balance">{balance}</span>
                            </p>
                        </div>
                        <div className="input">
                            <InputNumber
                                value={lpAmount}
                                onChange={lpAmountHandler}
                                placeholder="0.00"
                                className="custom-input"
                                type="number"
                            />
                            <div className="token">
                                <TokenIcon name={lp} size={24} />
                                <Button
                                    className="select-token-btn"
                                    onClick={openLpTokenList}
                                >
                                    {lp || 'Select LP'}
                                    <i className="icon-down size-24" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <i className="icon-arrow-down size-18" />
                <div className="input-item">
                    <p className="label">
                        {intl.formatMessage({
                            id: 'liquidity.withdraw.willreceive',
                        })}
                    </p>
                    <div className="input-item-content receive-tokens">
                        {receiveTokens.map((item) => (
                            <div className="receive-token-item">
                                <p className="token">
                                    <TokenIcon name={item.token} />
                                    {item.token}
                                </p>
                                <p className="value">{item.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="withdraw-btn-footer">
                    {!account && (
                        <Button
                            className="btn-mint common-btn common-btn-yellow"
                            onClick={() => {
                                requestConnectWallet();
                            }}
                        >
                            {intl.formatMessage({
                                id: 'app.unlockWallet',
                            })}
                        </Button>
                    )}
                    {lp && !isApproved && (
                        <Button
                            className="common-btn common-btn-yellow"
                            onClick={handleApprove}
                            loading={requestedApproval}
                        >
                            {intl.formatMessage({
                                id: 'liquidity.withdraw.approve',
                            })}
                        </Button>
                    )}
                    {isApproved && (
                        <Button
                            className="common-btn common-btn-yellow"
                            onClick={handleWithdraw}
                            loading={submitting}
                        >
                            {intl.formatMessage({ id: 'liquidity.withdraw' })}
                        </Button>
                    )}
                </div>
            </div>
            {receiveTokens.length > 0 && (
                <div className="provide-prices">
                    <div>
                        <p className="title">Prices</p>
                        <div className="prices-bg">
                            <div className="price-items">
                                <div className="price-item">
                                    <p className="token">
                                        1 {receiveTokens[0].token}
                                    </p>
                                    <p className="price">
                                        {receiveTokens[0].price}{' '}
                                        {receiveTokens[1].token}
                                    </p>
                                </div>
                                <div className="price-item">
                                    <p className="token">
                                        1 {receiveTokens[1].token}
                                    </p>
                                    <p className="price">
                                        {receiveTokens[1].price}{' '}
                                        {receiveTokens[0].token}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* <TransitionConfirm
                visable={showTxConfirm}
                onClose={() => setShowTxConfirm(false)}
            /> */}
        </div>
    );
};
