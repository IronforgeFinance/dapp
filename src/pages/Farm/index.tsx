import React, { useState } from 'react';
import './index.less';
import { history } from 'umi';
import PoolItem from './PoolItem';
export default () => {
    const [ftokenInfo, setfTokenInfo] = useState({
        price: 4.32,
        vol: 633656,
        supply: 588000,
    });
    const test = [
        {
            lp: 'fUSD-FTSLA',
            apy: '98%',
            totalStaked: 26262.33,
            earnedAmount: 100.0,
            earnedToken: 'FUSD',
            staked: 1234.0,
        },
        {
            lp: 'fUSD-FTSLA',
            apy: '98%',
            totalStaked: 26262.33,
            earnedAmount: 100.0,
            earnedToken: 'FUSD',
            staked: 1234.0,
        },
        {
            lp: 'fUSD-FTSLA',
            apy: '98%',
            totalStaked: 26262.33,
            earnedAmount: 100.0,
            earnedToken: 'FUSD',
            staked: 1234.0,
        },
        {
            lp: 'fUSD-FTSLA',
            apy: '98%',
            totalStaked: 26262.33,
            earnedAmount: 100.0,
            earnedToken: 'FUSD',
            staked: 1234.0,
        },
    ];
    const [poolItems, setPoolItems] = useState(test);
    return (
        <div className="farm-container">
            <div className="farm-header">
                <div className="info-item">
                    <p className="value">${ftokenInfo.price}</p>
                    <p className="label">fToken Price</p>
                </div>
                <div className="info-item">
                    <p className="value">${ftokenInfo.vol}</p>
                    <p className="label">fToken VOL</p>
                </div>
                <div className="info-item">
                    <p className="value">${ftokenInfo.supply}</p>
                    <p className="label">fToken Circulating Supply</p>
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
                {poolItems.map((item, index) => (
                    <PoolItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};
