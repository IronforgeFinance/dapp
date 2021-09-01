import React, { useState, useEffect } from 'react';
import './index.less';
import { history, useModel } from 'umi';
import StakeItem from './Stake';
import { useWeb3React } from '@web3-react/core';
import { LP_TOKENS } from '@/config/';
import useRefresh from '@/hooks/useRefresh';
export default () => {
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
            await fetchStakePoolList(LP_TOKENS, account);
        })();
    }, [account, slowRefresh]);

    return (
        <div className="farm-container">
            <div className="farm-header">
                <div className="info-item">
                    <p className="value">${ftokenInfo.price}</p>
                    <p className="label">BS Price</p>
                </div>
                <div className="info-item">
                    <p className="value">${ftokenInfo.vol}</p>
                    <p className="label">BS VOL</p>
                </div>
                <div className="info-item">
                    <p className="value">${ftokenInfo.supply}</p>
                    <p className="label">BS Circulating Supply</p>
                </div>
                <button
                    className="common-btn common-btn-red"
                    onClick={() => {
                        history.push('/farm/provide');
                    }}
                >
                    <span>Provide Liquidity</span>
                </button>
            </div>
            <div className="farm-pool">
                {stakeDataList.map((item, index) => (
                    <StakeItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};
