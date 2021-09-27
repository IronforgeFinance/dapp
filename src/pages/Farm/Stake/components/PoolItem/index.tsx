import './pc.less';
import './mobile.less';

import React, { useState } from 'react';
import { history, useIntl } from 'umi';
import { IStakePool } from '@/models/stakeData';
import { useMinerReward } from '@/hooks/useContract';
import { Button, Popover } from 'antd';
import { useModel } from 'umi';
import { useWeb3React } from '@web3-react/core';
import * as message from '@/components/Notification';
import { handleTxSent } from '@/utils';

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
    const { requestConnectWallet } = useModel('app', (model) => ({
        requestConnectWallet: model.requestConnectWallet,
    }));

    const intl = useIntl();

    const handleHarvest = async () => {
        try {
            setSubmitting(true);
            const tx = await MinerReward.harvest(poolId);
            await handleTxSent(tx, intl);
            setSubmitting(false);
            updateStakePoolItem({ poolId, poolName: name }, account);
            message.success('Harvest successfully. Pls check your balance.');
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
                    <p>{intl.formatMessage({ id: 'totalStaked' })}</p>
                </div>
                <div className="total-info">
                    <div className="total-info-item">
                        <p className="label">
                            {intl.formatMessage({ id: 'APY' })}:
                        </p>
                        <p className="value">
                            {(apy * 100).toFixed(2) + '%'}{' '}
                            <Popover
                                content={intl.formatMessage({ id: 'apyDesc' })}
                                trigger="hover"
                                placement="topRight"
                            >
                                <i className="icon-question size-16"></i>
                            </Popover>
                        </p>
                    </div>
                    <div className="total-info-item">
                        <p className="label">
                            {intl.formatMessage({ id: 'earn' })}:
                        </p>
                        <p className="value">
                            BS{' '}
                            <Popover
                                content={intl.formatMessage({ id: 'bsDesc' })}
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
                            <p className="label">
                                {intl.formatMessage({ id: 'bsTotalEarned' })}
                            </p>
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
                                    content={intl.formatMessage({
                                        id: 'bsTotalDesc',
                                    })}
                                    trigger="hover"
                                    placement="bottom"
                                >
                                    <i className="icon-question size-16"></i>
                                </Popover>
                            </p>
                            <Button
                                className="harvest-btn common-btn common-btn-yellow common-btn-s"
                                onClick={handleHarvest}
                                loading={submitting}
                                disabled={redeemableReward === 0 || !account}
                            >
                                {!submitting
                                    ? intl.formatMessage({ id: 'harvest' })
                                    : ''}
                            </Button>
                        </div>
                    </div>
                    <div className="user-info-item">
                        <p className="label">
                            {name} {intl.formatMessage({ id: 'STAKED' })}
                        </p>
                        <div className="value">
                            {account && (
                                <>
                                    <p
                                        className={
                                            staked === 0 ? 'value-zero' : ''
                                        }
                                    >
                                        {staked}
                                    </p>
                                    <Button
                                        className="stake-lp-btn common-btn common-btn-red common-btn-s"
                                        onClick={() => {
                                            props.handleFlipper();
                                            // history.push('/farm/stake?lp=' + name);
                                        }}
                                    >
                                        {intl.formatMessage({ id: 'stake' })}
                                    </Button>
                                </>
                            )}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
