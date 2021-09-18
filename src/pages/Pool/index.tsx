import './less/index.less';

import React, { useState, useEffect } from 'react';
import { history, useModel } from 'umi';
import { Button } from 'antd';
import StakeItem from '../Farm/Stake';
import { useWeb3React } from '@web3-react/core';
import { POOL_TOKENS } from '@/config';
import useRefresh from '@/hooks/useRefresh';
import { useIntl } from 'umi';

export default () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const [totalStaked, setTotalStaked] = useState(0);
    const {
        fetchStakePoolList,
        stakeDataList,
        singleTokenPoolTotalEarned,
        fetchSingleTokenPoolTotalEarned,
        setStakeDataList,
    } = useModel('stakeData', (model) => ({
        ...model,
    }));
    const { slowRefresh } = useRefresh();

    useEffect(() => {
        (async () => {
            fetchStakePoolList(POOL_TOKENS, account).then((list) => {
                const total = list.reduce((prev, item) => {
                    return prev + item.totalStaked;
                }, 0);
                setTotalStaked(total);
            });
            fetchSingleTokenPoolTotalEarned(POOL_TOKENS);
        })();
        return () => {
            setStakeDataList([]);
        };
    }, [slowRefresh]);

    return (
        <div className="farm-container">
            <div className="farm-header">
                <div className="info-item">
                    <p className="value">${totalStaked}</p>
                    <p className="label">
                        {intl.formatMessage({ id: 'pool.totalStaked' })}
                    </p>
                </div>
                <div className="info-item">
                    <p className="value">${singleTokenPoolTotalEarned}</p>
                    <p className="label">
                        {intl.formatMessage({ id: 'pool.totalEarned' })}
                    </p>
                </div>
            </div>
            <div className="farm-pool">
                {stakeDataList.map((item, index) => (
                    <StakeItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};
