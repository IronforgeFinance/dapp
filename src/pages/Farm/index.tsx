import './pc.less';
import './mobile.less';

import React, { useState, useEffect, Fragment } from 'react';
import { history, useModel } from 'umi';
import { Button } from 'antd';
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
import ISwitch from '@/components/Switch';
export default () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const [fTokenPrice, setFTokenPrice] = useState(0);
    const [circulatinVal, setCirculatinVal] = useState(0);
    const [tvl, setTvl] = useState(0);
    const [totalEarned, setTotalEarned] = useState(0);
    const [checked, setChecked] = useState(true);
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
        <Fragment>
            <div className="farm-header">
                <div className="info-item">
                    <p className="value">${tvl}</p>
                    <p className="label">
                        {intl.formatMessage({ id: 'liquidity.bs.tvl' })}
                    </p>
                </div>
                <div className="info-item">
                    <p className="value">${circulatinVal}</p>
                    <p className="label">
                        {intl.formatMessage({
                            id: 'liquidity.bs.circulatingVal',
                        })}
                    </p>
                </div>
                <div className="info-item">
                    <p className="value">${totalEarned}</p>
                    <p className="label">
                        {intl.formatMessage({
                            id: 'liquidity.bs.totalEarned',
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
            <div className="farm-tabs">
                <ISwitch
                    checkedChildren="Farm"
                    unCheckedChildren="Pool"
                    onChange={setChecked}
                    checked={checked}
                />
            </div>

            <div
                className="farm-pool"
                style={{
                    display: checked ? 'flex' : 'none',
                }}
            >
                {LP_TOKENS.map((item, index) => (
                    <StakeItem key={index} {...item} noDiamond={!checked} />
                ))}
            </div>

            <div
                className="farm-pool"
                style={{
                    display: !checked ? 'flex' : 'none',
                }}
            >
                {POOL_TOKENS.map((item, index) => (
                    <StakeItem key={index} {...item} noDiamond={!checked} />
                ))}
            </div>
        </Fragment>
    );
};
