import './less/index.less';

import React, { useState, useEffect } from 'react';
import { history, useModel } from 'umi';
import { Button, Tabs } from 'antd';
import StakeItem from './Stake';
import { useWeb3React } from '@web3-react/core';
import { LP_TOKENS, PLATFORM_TOKEN, POOL_TOKENS } from '@/config';
import useRefresh from '@/hooks/useRefresh';
import { useIntl } from 'umi';
import { getTokenPrice } from '@/utils';
import { usePlatformToken, useMinerReward } from '@/hooks/useContract';
import Tokens from '@/config/constants/tokens';
import { ethers } from 'ethers';
import { expandTo18Decimals, toFixedWithoutRound } from '@/utils/bigNumber';
import useWeb3Provider from '@/hooks/useWeb3Provider';
const { TabPane } = Tabs;
const TabKeys = {
    FARM: 'farm',
    POOL: 'pool',
};
export default () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const [fTokenPrice, setFTokenPrice] = useState(0);
    const [circulatinVal, setCirculatinVal] = useState(0);
    const [tvl, setTvl] = useState(0);
    const [totalEarned, setTotalEarned] = useState(0);
    const [tabKey, setTabKey] = useState(TabKeys.FARM);
    const { fetchStakePoolList, stakeDataList, setStakeDataList } = useModel(
        'stakeData',
        (model) => ({
            ...model,
        }),
    );
    const provider = useWeb3Provider();

    const minerReward = useMinerReward();
    const fToken = usePlatformToken();
    const { slowRefresh } = useRefresh();
    const [ftokenInfo, setfTokenInfo] = useState({
        price: 4.32,
        vol: 633656,
        supply: 588000,
    });

    const getTVL = async () => {
        //计算前两个池子的锁仓值
        const price = await getTokenPrice(PLATFORM_TOKEN);

        const pools = [
            { poolName: 'BS', poolId: 0 },
            { poolName: 'BS', poolId: 1 },
        ];
        const poolInfos = await Promise.all(
            pools.map((item) => {
                return minerReward.poolInfo(item.poolId);
            }),
        );
        const total = poolInfos.reduce((val, item) => {
            const amount = parseFloat(ethers.utils.formatEther(item.amount));
            return (val += amount);
        }, 0);
        const tvl = toFixedWithoutRound(total * price, 2);
        setTvl(tvl);
    };

    const getTotalEarned = async () => {
        const price = await getTokenPrice(PLATFORM_TOKEN);
        const amount = await fToken.manualMinted();
        const val = Number(ethers.utils.formatEther(amount)) * price;
        setTotalEarned(toFixedWithoutRound(val, 2));
    };
    const getTotalSupply = async () => {
        const price = await getTokenPrice(PLATFORM_TOKEN);
        const res = await fToken.totalSupply();
        const supply = ethers.utils.formatEther(res);
        const val = toFixedWithoutRound(price * Number(supply), 2);
        setCirculatinVal(val);
    };

    useEffect(() => {
        getTVL();
        getTotalEarned();
        getTotalSupply();
    }, [provider, slowRefresh]);

    return (
        <div className="farm-container">
            <div className="farm-header">
                <div className="info-item">
                    <p className="value">${tvl}</p>
                    <p className="label">
                        {intl.formatMessage({ id: 'liquidity.bs.price' })}
                    </p>
                </div>
                <div className="info-item">
                    <p className="value">${circulatinVal}</p>
                    <p className="label">
                        {intl.formatMessage({ id: 'liquidity.bs.vol' })}
                    </p>
                </div>
                <div className="info-item">
                    <p className="value">${totalEarned}</p>
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
            <div className="tabs">
                <Tabs
                    onChange={(key) => {
                        setTabKey(key);
                    }}
                    type="card"
                    className="custom-tabs"
                >
                    <TabPane
                        tab={'Farm'}
                        key={TabKeys.FARM}
                        className="custom-tab-pane"
                    ></TabPane>
                    <TabPane
                        tab={'Pool'}
                        key={TabKeys.POOL}
                        className="custom-tab-pane"
                    ></TabPane>
                </Tabs>
            </div>

            <div
                className="farm-pool"
                style={{
                    display: tabKey === TabKeys.FARM ? 'flex' : 'none',
                }}
            >
                {LP_TOKENS.map((item, index) => (
                    <StakeItem key={index} {...item} />
                ))}
            </div>

            <div
                className="farm-pool"
                style={{
                    display: tabKey === TabKeys.POOL ? 'flex' : 'none',
                }}
            >
                {POOL_TOKENS.map((item, index) => (
                    <StakeItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};
