import React, { useState } from 'react';
import './index.less';
import { history } from 'umi';
import { IStakePool } from '@/models/stakeData';
import { useMinerReward } from '@/hooks/useContract';
import { Button } from 'antd';
import { useModel } from 'umi';
import { useWeb3React } from '@web3-react/core';
import * as message from '@/components/Notification';

export default (props: IStakePool) => {
    const {
        name,
        apy,
        totalStaked,
        totalPendingReward,
        redeemableReward,
        staked,
        poolId,
    } = props;
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
            <div className={`lp-token lp-token-left`}>
                <div className={`lp-token-${token1}`}></div>
            </div>
            <div className={`lp-token lp-token-right`}>
                <div className={`lp-token-${token2}`}></div>
            </div>
            <div className="pool-item-container">
                <div className="pool-item-title">
                    <p>{name}</p>
                </div>
                <div className="total-info">
                    <div className="total-info-item">
                        <p className="label">APY</p>
                        <p className="value">{(apy * 100).toFixed(2) + '%'}</p>
                    </div>
                    <div className="total-info-item">
                        <p className="label">Total staked</p>
                        <p className="value">{totalStaked}</p>
                    </div>
                </div>

                <div className="user-info">
                    <div className="user-info-item">
                        <div className="label-item">
                            <p className="label">BS Total EARNED</p>
                            <p className="label">{totalPendingReward}</p>
                        </div>
                        <div className="value">
                            <p>{redeemableReward}</p>
                            <Button
                                className="common-btn common-btn-yellow common-btn-s"
                                onClick={handleHarvest}
                                loading={submitting}
                            >
                                Harvest
                            </Button>
                        </div>
                    </div>
                    <div className="user-info-item">
                        <p className="label">{name} STAKED</p>
                        <div className="value">
                            <p>{staked}</p>
                            <button
                                className="common-btn common-btn-red common-btn-s"
                                onClick={() => {
                                    history.push('/farm/stake?lp=' + name);
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
