import './pc.less';
import './mobile.less';

import { useState, useContext } from 'react';
import { Button, Popover } from 'antd';
import { useModel, useIntl } from 'umi';
import Overlay from '@/components/Overlay';
import { useWeb3React } from '@web3-react/core';
import { useMinerReward } from '@/hooks/useContract';
import * as message from '@/components/Notification';
import { ClaimRewardsContext } from './provider';

const POOL_ID = 0;

export const useClaimRewards = () => {
    return useContext(ClaimRewardsContext);
};

const ClaimRewards = () => {
    const intl = useIntl();
    const { visable, close } = useContext(ClaimRewardsContext);
    const [submitting, setSubmitting] = useState(false);
    const { account } = useWeb3React();

    const { fetchStakePoolList, stakeDataList } = useModel(
        'stakeData',
        (model) => {
            return { ...model };
        },
    );

    const MinerReward = useMinerReward();

    const fetchRewardInfo = async () => {
        fetchStakePoolList([{ poolName: 'BS', poolId: POOL_ID }], account);
    };

    const handleRedeem = async () => {
        try {
            setSubmitting(true);
            const tx = await MinerReward.harvest(POOL_ID);
            const receipt = await tx.wait();
            console.log(receipt);
            setSubmitting(false);
            fetchRewardInfo();
            message.success('Harvest successfully. Pls check your balance.');
        } catch (err) {
            console.log(err);
            setSubmitting(false);
        }
    };

    return (
        <Overlay visable={visable}>
            <section className="claim-rewards">
                <a className="back-btn" onClick={close} />
                <ul className="cards-group">
                    <li className="total-locked card">
                        <div className="before" />
                        <div className="content">
                            <i className="icon-staked" />
                            <span className="value">
                                {account ? `$00.0` : '--'}
                            </span>
                            <span className="label">
                                {intl.formatMessage({ id: 'totalStaked' })}
                                <Popover
                                    trigger="hover"
                                    placement="topRight"
                                    content={intl.formatMessage({
                                        id: 'rewardsTip',
                                    })}
                                >
                                    <i className="icon-question size-20" />
                                </Popover>
                            </span>
                        </div>
                        <div className="after" />
                    </li>
                    <li className="total-rewards card">
                        <div className="before" />
                        <div className="content">
                            <i className="icon-rewards" />
                            <span className="value">
                                {account ? `$00.0` : '--'}
                            </span>
                            <span className="label">
                                {intl.formatMessage({ id: 'totalRewards' })}{' '}
                                <Popover
                                    trigger="hover"
                                    placement="topRight"
                                    content={intl.formatMessage({
                                        id: 'earningRatioTip',
                                    })}
                                >
                                    <i className="icon-question size-20" />
                                </Popover>
                            </span>
                        </div>
                        <div className="after" />
                    </li>
                    <li className="claim card">
                        <div className="before" />
                        <div className="content-wrapper">
                            <div className="content">
                                <span className="value">
                                    {account
                                        ? `${stakeDataList[0]?.totalPendingReward} BS`
                                        : '--'}
                                </span>
                                <span className="label">
                                    {intl.formatMessage({
                                        id: 'rewards',
                                    })}{' '}
                                    <Popover
                                        trigger="hover"
                                        placement="topRight"
                                        content={intl.formatMessage({
                                            id: 'rewardsTip',
                                        })}
                                    >
                                        <i className="icon-question size-20" />
                                    </Popover>
                                </span>
                            </div>
                            <div className="content">
                                <span className="value">
                                    {account
                                        ? `${
                                              (
                                                  stakeDataList[0]?.apy * 100
                                              ).toFixed(4) + '%'
                                          }`
                                        : '--'}
                                </span>
                                <span className="label">
                                    {intl.formatMessage({
                                        id: 'earningRatioTip',
                                    })}{' '}
                                    <Popover
                                        trigger="hover"
                                        placement="topRight"
                                        content={intl.formatMessage({
                                            id: 'earningRatioTip',
                                        })}
                                    >
                                        <i className="icon-question size-20" />
                                    </Popover>
                                </span>
                            </div>
                            <div className="content">
                                <span className="value">
                                    {account
                                        ? `${
                                              (
                                                  stakeDataList[0]?.apy * 100
                                              ).toFixed(4) + '%'
                                          }`
                                        : '--'}
                                </span>
                                <Button className="claim-btn common-btn common-btn-red">
                                    {intl.formatMessage({ id: 'claim' })}
                                </Button>
                            </div>
                        </div>
                        <div className="after" />
                    </li>
                </ul>
            </section>
        </Overlay>
    );
};

export default ClaimRewards;
