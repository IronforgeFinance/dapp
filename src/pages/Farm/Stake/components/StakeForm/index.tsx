import React, { useState, useEffect } from 'react';
import { InputNumber, Select, Progress, Button } from 'antd';
import * as message from '@/components/Notification';
import './index.less';
import { LP_TOKENS } from '@/config';
import { STAKE_TABS } from '../../index';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import {
    useCheckERC20ApprovalStatus,
    useERC20Approve,
} from '@/hooks/useApprove';
import { useMinerReward } from '@/hooks/useContract';
import Tokens from '@/config/constants/tokens';
import Contracts from '@/config/constants/contracts';
import { useWeb3React } from '@web3-react/core';
import { expandTo18Decimals } from '@/utils/bigNumber';
import { ethers } from 'ethers';
export default (props: { tabKey: string; lp?: string }) => {
    const [submitting, setSubmitting] = useState(false);
    const { tabKey, lp: lpParam } = props;
    const [lpAmount, setLpAmount] = useState();
    const [staked, setStaked] = useState<number>();
    const [lp, setLp] = useState<string>(lpParam || LP_TOKENS[0].poolName);

    const { account } = useWeb3React();

    const MinerReward = useMinerReward();

    const minerRewardContract = Contracts.MinerReward[process.env.APP_CHAIN_ID];
    const { isApproved, setLastUpdated } = useCheckERC20ApprovalStatus(
        lp ? Tokens[lp].address[process.env.APP_CHAIN_ID] : '',
        minerRewardContract,
    );
    const { handleApprove, requestedApproval } = useERC20Approve(
        lp ? Tokens[lp].address[process.env.APP_CHAIN_ID] : '',
        minerRewardContract,
        setLastUpdated,
    );

    const fetchStakedBalance = async () => {
        const poolId = LP_TOKENS.find((item) => item.poolName === lp).poolId;
        const userInfo = await MinerReward.userInfo(poolId, account);
        const staked = parseFloat(ethers.utils.formatEther(userInfo.amount));
        setStaked(staked);
    };

    useEffect(() => {
        if (tabKey === STAKE_TABS.unstake && account) {
            fetchStakedBalance();
        }
    }, [tabKey, account, lp]);
    const { balance: lpBalance, refresh: refreshBalance } = useBep20Balance(lp);

    const handleSubmit = async () => {
        if (!lp || !lpAmount) {
            return;
        }
        if (
            (tabKey === STAKE_TABS.stake && Number(lpAmount) > lpBalance) ||
            (tabKey === STAKE_TABS.unstake && Number(lpAmount) > staked)
        ) {
            return;
        }

        if (!account) {
            return;
        }
        try {
            setSubmitting(true);
            const poolId = LP_TOKENS.find(
                (item) => item.poolName === lp,
            ).poolId;
            if (tabKey === STAKE_TABS.stake) {
                const tx = await MinerReward.deposit(
                    account,
                    poolId,
                    expandTo18Decimals(lpAmount),
                );
                message.info(
                    'Stake tx sent out successfully. Pls wait for a while......',
                );
                const receipt = await tx.wait();
                console.log(receipt);
                setSubmitting(false);
                message.success('Stake successfully. Pls check your balance.');
                refreshBalance();
            } else {
                const tx = await MinerReward.withdraw(
                    account,
                    poolId,
                    expandTo18Decimals(lpAmount),
                );
                message.info(
                    'Unstake tx sent out successfully. Pls wait for a while......',
                );
                const receipt = await tx.wait();
                console.log(receipt);
                setSubmitting(false);
                message.success(
                    'Unstake successfully. Pls check your balance.',
                );
                fetchStakedBalance();
            }
        } catch (err) {
            console.log(err);
            setSubmitting(false);
        }
    };
    return (
        <div className="provide-form common-box">
            <div className="input-item">
                <p className="label">Asset</p>
                <div className="input-item-content">
                    <div className="content-label">
                        <p className="right">
                            Balance:
                            <span className="balance">
                                {tabKey === STAKE_TABS.stake
                                    ? lpBalance
                                    : staked}
                            </span>
                        </p>
                    </div>
                    <div className="input">
                        <InputNumber
                            value={lpAmount}
                            onChange={(v) => {
                                setLpAmount(v);
                            }}
                            placeholder="0.00"
                            className="custom-input"
                        />
                        <div className="token">
                            <Select
                                value={lp}
                                onChange={(v) => {
                                    setLp(v);
                                }}
                            >
                                {LP_TOKENS.map((item) => (
                                    <Select.Option
                                        value={item.poolName}
                                        key={item.poolName}
                                    >
                                        {item.poolName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="btn-footer">
                {isApproved && (
                    <Button
                        className="common-btn common-btn-red"
                        onClick={handleSubmit}
                        loading={submitting}
                    >
                        {tabKey === STAKE_TABS.stake ? 'Stake' : 'Unstake'}
                    </Button>
                )}
                {lp && !isApproved && (
                    <Button
                        className="btn-mint common-btn common-btn-red"
                        onClick={handleApprove}
                        loading={requestedApproval}
                    >
                        Approve To Stake
                    </Button>
                )}
            </div>
            {lp && tabKey === STAKE_TABS.stake && (
                <div className="info-footer">
                    <p className="tips">Don't have {lp}?</p>
                    <p className="link">
                        Get {lp} LP <span></span>{' '}
                    </p>
                </div>
            )}
        </div>
    );
};
