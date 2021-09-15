import './less/index.less';

import React, { useState, useEffect } from 'react';
import { history, useModel } from 'umi';
import { Button } from 'antd';
import StakeItem from './Stake';
import { useWeb3React } from '@web3-react/core';
import { LP_TOKENS } from '@/config';
import useRefresh from '@/hooks/useRefresh';
import { useIntl } from 'umi';

export default () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const { fetchStakePoolList, stakeDataList } = useModel(
        'stakeData',
        (model) => ({
            ...model,
        }),
    );
    const { slowRefresh } = useRefresh();
    const [ftokenInfo, setfTokenInfo] = useState({
        price: 4.32,
        vol: 633656,
        supply: 588000,
    });

    useEffect(() => {
        (async () => {
            if (account) {
                await fetchStakePoolList(LP_TOKENS, account);
            }
        })();
    }, [account, slowRefresh]);

    return (
        <div className="farm-container">
            <div className="farm-header">
                <div className="info-item">
                    <p className="value">${ftokenInfo.price}</p>
                    <p className="label">
                        {intl.formatMessage({ id: 'liquidity.bs.price' })}
                    </p>
                </div>
                <div className="info-item">
                    <p className="value">${ftokenInfo.vol}</p>
                    <p className="label">
                        {intl.formatMessage({ id: 'liquidity.bs.vol' })}
                    </p>
                </div>
                <div className="info-item">
                    <p className="value">${ftokenInfo.supply}</p>
                    <p className="label">
                        {intl.formatMessage({
                            id: 'liquidity.bs.circulatingsupply',
                        })}
                    </p>
                </div>
                <Button
                    className="add-liquidity-btn common-btn common-btn-red"
                    onClick={() => {
                        history.push('/farm/provide');
                    }}
                >
                    <span>
                        {intl.formatMessage({
                            id: 'liquidity.toprovide',
                        })}
                    </span>
                </Button>
            </div>
            <div className="farm-pool">
                {stakeDataList.map((item, index) => (
                    <StakeItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};
