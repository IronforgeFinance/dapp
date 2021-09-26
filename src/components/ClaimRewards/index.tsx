import './pc.less';
import './mobile.less';

import { useState, useContext } from 'react';
import { Button, Popover } from 'antd';
import { useModel } from 'umi';
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
                    <li className="rewards card">
                        <div className="before" />
                        <div className="content">
                            <i className="icon-rewards" />
                            <span className="value">
                                {account
                                    ? `${stakeDataList[0]?.totalPendingReward} BS`
                                    : '--'}
                            </span>
                            <span className="label">Rewards</span>
                            <div className="bottom">
                                <p className="price">
                                    {account
                                        ? `${stakeDataList[0]?.redeemableReward} BS`
                                        : '--'}
                                    <Popover
                                        trigger="hover"
                                        placement="topLeft"
                                        content="收益来自于铸造中锁仓的BS，50%可即刻提取，50%将于30天内线性释放。"
                                    >
                                        <i className="icon-question size-20" />
                                    </Popover>
                                </p>
                                <Button
                                    className="claim-btn common-btn common-btn-red"
                                    onClick={handleRedeem}
                                    disabled={
                                        stakeDataList[0]?.redeemableReward <= 0
                                    }
                                    loading={submitting}
                                >
                                    Claim
                                </Button>
                            </div>
                        </div>
                        <div className="after" />
                    </li>
                    <li className="ratio card">
                        <div className="before" />
                        <div className="content">
                            <span className="value">
                                {account
                                    ? `${
                                          (stakeDataList[0]?.apy * 100).toFixed(
                                              4,
                                          ) + '%'
                                      }`
                                    : '--'}
                            </span>
                            <span className="label">
                                Earning ratio{' '}
                                <Popover
                                    trigger="hover"
                                    placement="topRight"
                                    content="APR"
                                >
                                    <i className="icon-question size-20" />
                                </Popover>
                            </span>
                        </div>
                        <div className="after" />
                    </li>
                </ul>
            </section>
        </Overlay>
    );
};

export default ClaimRewards;
