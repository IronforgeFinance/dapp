import React, { useState } from 'react';
import './index.less';
import { history } from 'umi';
import { IStakePool } from '@/models/stakeData';
import { useMinerReward } from '@/hooks/useContract';
import { Button, Popover } from 'antd';
import { useModel } from 'umi';
import { useWeb3React } from '@web3-react/core';
import * as message from '@/components/Notification';

export default (props: { pool: IStakePool; handleFlipper: () => void }) => {
    const {
        name,
        apy,
        totalStaked,
        totalPendingReward,
        redeemableReward,
        staked,
        poolId,
    } = props.pool;
    const [token1, token2] = name.split('-');
    const [submitting, setSubmitting] = useState(false);
    const MinerReward = useMinerReward();
    const { account } = useWeb3React();
    const { updateStakePoolItem } = useModel('stakeData', (model) => ({
        ...model,
    }));

    const handleHarvest = async () => {
        try {
            setSubmitting(true);
            const tx = await MinerReward.harvest(poolId);
            const receipt = await tx.wait();
            console.log(receipt);
            setSubmitting(false);
            updateStakePoolItem({ poolId, poolName: name }, account);
            message.success('Harvest successfully. Pls check your balance.');
        } catch (err) {
            console.log(err);
            setSubmitting(false);
        }
    };
    return (
        <div className="pool-item">
           
            <div className="pool-item-container">
                <div className="pool-item-title">
                    <p>{name}</p>
                </div>
                <div className="pool-total-staked">
                    <p>${totalStaked}</p>
                    <p>Total staked</p>
                </div>
                <div className="total-info">
                    <div className="total-info-item">
                        <p className="label">APY:</p>
                        <p className="value">
                            {(apy * 100).toFixed(2) + '%'}{' '}
                            <Popover
                                content={'这是APY计算规则说明'}
                                trigger="hover"
                                placement="topRight"
                            >
                                <i className="icon-question size-16"></i>
                            </Popover>
                        </p>
                    </div>
                    <div className="total-info-item">
                        <p className="label">EARN:</p>
                        <p className="value">
                            BS{' '}
                            <Popover
                                content={'这是奖励说明'}
                                trigger="hover"
                                placement="topRight"
                            >
                                <i className="icon-question size-16"></i>
                            </Popover>
                        </p>
                    </div>
                </div>

                <div className="user-info">
                    <div className="user-info-item">
                        <div className="label-item">
                            <p className="label">BS Total EARNED</p>
                            <p className="label">{totalPendingReward}</p>
                        </div>
                        <div className="value">
                            <p
                                className={
                                    redeemableReward === 0 ? 'value-zero' : ''
                                }
                            >
                                {redeemableReward}{' '}
                                <Popover
                                    content={'Redeemable'}
                                    trigger="hover"
                                    placement="bottom"
                                >
                                    <i className="icon-question size-16"></i>
                                </Popover>
                            </p>
                            <Button
                                className="common-btn common-btn-yellow common-btn-s"
                                onClick={handleHarvest}
                                loading={submitting}
                                disabled={redeemableReward === 0}
                            >
                                Harvest
                            </Button>
                        </div>
                    </div>
                    <div className="user-info-item">
                        <p className="label">{name} STAKED</p>
                        <div className="value">
                            <p className={staked === 0 ? 'value-zero' : ''}>
                                {staked}
                            </p>
                            <button
                                className="common-btn common-btn-red common-btn-s"
                                onClick={() => {
                                    props.handleFlipper();
                                    // history.push('/farm/stake?lp=' + name);
                                }}
                            >
                                Stake LP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
