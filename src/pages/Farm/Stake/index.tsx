import './pc.less';
import './mobile.less';

import React, { useState, useEffect, Fragment } from 'react';
import StakeForm from './components/StakeForm';
import PoolItem from './components/PoolItem';
import classnames from 'classnames';
import { IStakePool } from '@/models/stakeData';
import { TokenIcon } from '@/components/Icon';
import { useModel } from 'umi';
import { DEFAULT_POOL } from '@/models/stakeData';
import { useWeb3React } from '@web3-react/core';
import useRefresh from '@/hooks/useRefresh';

export default (props: {
    poolName: string;
    poolId: number;
    noDiamond?: boolean;
}) => {
    const { poolName, poolId, noDiamond } = props;
    const [showStakeForm, setShowStakeForm] = useState(false);
    const [stakeData, setStakeData] = useState<IStakePool>({
        ...DEFAULT_POOL,
        name: props.poolName,
    });
    const handleFlipper = () => {
        setShowStakeForm(!showStakeForm);
    };
    const { account } = useWeb3React();
    const { slowRefresh } = useRefresh();

    const { fetchStakePoolData } = useModel('stakeData', (model) => ({
        ...model,
    }));
    const [token1, token2] = poolName.split('-');

    useEffect(() => {
        fetchPoolData();
    }, [account, slowRefresh]);

    const fetchPoolData = async () => {
        const data = await fetchStakePoolData(poolName, poolId, account);
        setStakeData(data);
    };
    return (
        <div
            className={classnames(
                'flip-container',
                showStakeForm ? 'flipper-over' : '',
            )}
        >
            <div className="flipper">
                <div className="front">
                    {!noDiamond && (
                        <Fragment>
                            <div className={`lp-token lp-token-left`}>
                                <TokenIcon name={token1}></TokenIcon>
                            </div>
                            <div className={`lp-token lp-token-right`}>
                                <TokenIcon name={token2}></TokenIcon>
                            </div>
                        </Fragment>
                    )}

                    <PoolItem pool={stakeData} handleFlipper={handleFlipper} />
                </div>
                <div className="back">
                    <div className={`lp-token lp-token-left`}>
                        <TokenIcon name={token1}></TokenIcon>
                    </div>
                    <div className={`lp-token lp-token-right`}>
                        <TokenIcon name={token2}></TokenIcon>
                    </div>
                    <StakeForm
                        lp={poolName}
                        handleFlipper={handleFlipper}
                        updatePool={fetchPoolData}
                    />
                </div>
            </div>
        </div>
    );
};
