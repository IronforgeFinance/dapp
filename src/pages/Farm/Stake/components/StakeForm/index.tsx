import './less/index.less';

import React, { useState, useEffect } from 'react';
import { InputNumber, Select, Progress, Button } from 'antd';
import * as message from '@/components/Notification';
import { LP_TOKENS, POOL_TOKENS } from '@/config';

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
import TabGroup from '@/components/TabGroup';
import { useModel } from 'umi';
const STAKE_TOKENS = [...LP_TOKENS, ...POOL_TOKENS];
enum STAKE_TABS {
    stake = 'stake',
    unstake = 'unstake',
}

const tabItems = [
    {
        name: 'Stake',
        key: 'stake',
    },
    {
        name: 'Unstake',
        key: 'unstake',
    },
];

export default (props: {
    lp: string;
    handleFlipper: () => void;
    updatePool: () => void;
}) => {
    const [submitting, setSubmitting] = useState(false);
    const { lp, handleFlipper, updatePool } = props;
    const [tabKey, setTabKey] = useState(tabItems[0].key);
    const [lpAmount, setLpAmount] = useState<number>();
    const [staked, setStaked] = useState<number>();

    const { updateStakePoolItem } = useModel('stakeData', (model) => ({
        ...model,
    }));
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
        const poolId = STAKE_TOKENS.find((item) => item.poolName === lp).poolId;
        const userInfo = await MinerReward.userInfo(poolId, account);
        const staked = parseFloat(ethers.utils.formatEther(userInfo.amount));
        setStaked(staked);
    };

    useEffect(() => {
        setLpAmount(0);
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
            const poolId = STAKE_TOKENS.find(
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
            updatePool();
        } catch (err) {
            console.log(err);
            setSubmitting(false);
        }
    };
    return (
        <div className="stake-form common-box">
            <TabGroup
                items={tabItems}
                value={tabKey}
                onChange={(v) => {
                    setTabKey(v);
                }}
                className="custom-tabs-group"
            />
            <button
                className="common-btn-back custom-icon-back"
                onClick={() => {
                    props.handleFlipper();
                }}
            />
            <div className="input-item custom-input-container">
                <p className="label">Amount</p>
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
                            type="number"
                        />
                        <div className="custom-token">
                            <span
                                className="btn-max"
                                onClick={() => {
                                    setLpAmount(
                                        tabKey === STAKE_TABS.stake
                                            ? lpBalance
                                            : staked,
                                    );
                                }}
                            >
                                Max
                            </span>
                            <span className="token-name">{lp}</span>
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
            {lp && lp.includes('-') && tabKey === STAKE_TABS.stake && (
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
