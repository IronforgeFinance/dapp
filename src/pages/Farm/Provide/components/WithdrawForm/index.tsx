import React, { useState, useEffect } from 'react';
import { InputNumber, Select, Button } from 'antd';
import * as message from '@/components/Notification';
import IconDown from '@/assets/images/icon-down.svg';
import './index.less';
import { debounce } from 'lodash';
import { useModel } from 'umi';
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
export default () => {
    const [lp, setLp] = useState<string>();
    const [lpAmount, setLpAmount] = useState<number>();
    const [receiveTokens, setReceiveTokens] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const routerContract = useRouter();
    const { account } = useWeb3React();

    const { lpDataList } = useModel('lpData', (model) => ({
        ...model,
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
        const handleReceiveTokens = debounce(() => {
            if (lp && lpAmount) {
                const lpData = lpDataList.find((item) => item.symbol === lp);
                if (lpData) {
                    const token1Amount =
                        (lpAmount * lpData.token1Balance) / lpData.balance;
                    const token2Amount =
                        (lpAmount * lpData.token2Balance) / lpData.balance;
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
            message.info(
                'Withdraw tx sent out successfully. Pls wait for a while......',
            );
            const receipt = await tx.wait();
            console.log(receipt);
            setSubmitting(false);
            message.success('Withdraw successfully. Pls check your balance.');
            //更新数据
            refreshBalance();
        } catch (err) {
            console.log(err);
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="provide-form common-box">
                <div className="input-item">
                    <p className="label">LP</p>
                    <div className="input-item-content">
                        <div className="content-label">
                            <p className="right">
                                Balance:
                                <span className="balance">{balance}</span>
                            </p>
                        </div>
                        <div className="input">
                            <InputNumber
                                value={lpAmount}
                                onChange={lpAmountHandler}
                                placeholder="0.00"
                                className="custom-input"
                            />
                            <div className="token">
                                <Select
                                    value={lp}
                                    onSelect={(v) => {
                                        setLp(v);
                                    }}
                                    placeholder={'Select LP'}
                                >
                                    {lpDataList.map((item) => (
                                        <Select.Option
                                            value={item.symbol}
                                            key={item.symbol}
                                        >
                                            {item.symbol}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <img src={IconDown} alt="" className="icon-add" />

                <div className="input-item">
                    <p className="label">You'll Receive</p>
                    <div className="input-item-content receive-tokens">
                        {receiveTokens.map((item) => (
                            <div className="receive-token-item">
                                <p className="token">{item.token}</p>
                                <p className="value">{item.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="withdraw-btn-footer">
                    {lp && !isApproved && (
                        <Button
                            className="common-btn common-btn-yellow"
                            onClick={handleApprove}
                            loading={requestedApproval}
                        >
                            Approve to withdraw
                        </Button>
                    )}
                    {isApproved && (
                        <Button
                            className="common-btn common-btn-yellow"
                            onClick={handleWithdraw}
                            loading={submitting}
                        >
                            Withdraw
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
        </div>
    );
};
