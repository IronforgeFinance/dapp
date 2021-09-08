import './less/index.less';

import React, { useState, useEffect, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
    useDebtSystem,
    useCollateralSystem,
    usePrices,
} from '@/hooks/useContract';
import { ethers } from 'ethers';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import IconDown from '@/assets/images/down.svg';
import DebtInfoDetail from './components/DebtInfoDetail';
import DebtInfoSimple from './components/SimpleDebtInfo';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import { useModel } from 'umi';
import { COLLATERAL_TOKENS } from '@/config';
import { TokenIcon } from '@/components/Icon';
import { getTokenPrice } from '@/utils';

interface IDebtItemProps {
    mintedToken: string;
    mintedTokenName: string;
}

export interface IDebtItemInfo {
    collateralToken: string;
    ratio: string;
    ratioValue: number | string;
    debt: number;
    locked: number;
}

export default (props: IDebtItemProps) => {
    const { mintedToken, mintedTokenName } = props;
    const [mintedTokenNum, setMintedTokenNum] = useState(0);
    // const [debtInUSD, setDebtInUSD] = useState(0.0)
    const [debtItemInfos, setDebtItemInfos] = useState<IDebtItemInfo[]>([]);
    const [showInfos, setShowInfos] = useState(false);
    const { account } = useWeb3React();
    const collateralSystem = useCollateralSystem();
    const debtSystem = useDebtSystem();
    const provider = useWeb3Provider();

    const {
        selectedDebtInfos,
        selectedDebtInUSD,
        setSelectedDebtItemInfos,
        setSelectedDebtInUSD,
    } = useModel('burnData', (model) => ({
        selectedDebtInUSD: model.selectedDebtInUSD,
        selectedDebtInfos: model.selectedDebtInfos,
        setSelectedDebtItemInfos: model.setSelectedDebtInfos,
        setSelectedDebtInUSD: model.setSelectedDebtInUSD,
    }));

    const { lockedData, setLockedData } = useModel('dataView', (model) => ({
        lockedData: model.lockedData,
        setLockedData: model.setLockedData,
    }));

    useEffect(() => {
        (async () => {
            if (Number(selectedDebtInUSD) > 0) {
                const price = await getTokenPrice(mintedToken);
                const num = price
                    ? toFixedWithoutRound(selectedDebtInUSD / price, 2)
                    : 0;
                setMintedTokenNum(num);
            }
        })();
    }, [selectedDebtInUSD]);

    const { balance: fusdBalance } = useBep20Balance('FUSD');
    const prices = usePrices();

    /* TODO:合约接口没有查询total debt in usd，
    只能查询某个抵押物currency 对应的debt in usd。
    前端先写死支持的币，然后分别查询debt in usd，并求和; 
    */
    const getDebtInUSD = async () => {
        const res = await Promise.all(
            COLLATERAL_TOKENS.map((token) =>
                debtSystem.GetUserDebtBalanceInUsd(
                    account,
                    ethers.utils.formatBytes32String(token.name),
                ),
            ),
        );

        const totalDebtInUsd = res.reduce((total, item) => {
            const val = parseFloat(ethers.utils.formatUnits(item[0], 18));
            total += val;
            return total;
        }, 0);
        const val = toFixedWithoutRound(totalDebtInUsd, 2);
        console.log('getDebtInUSD: ', totalDebtInUsd);
        setSelectedDebtInUSD(val);
    };

    const getCollateralDataByToken = async (account, token) => {
        const res = await collateralSystem.getUserCollateral(
            account,
            ethers.utils.formatBytes32String(token),
        );
        const data = parseFloat(ethers.utils.formatUnits(res, 18));
        const price = await getTokenPrice(token);
        const collateralInUSD = data * price;
        console.log('getCollateralData: ', token, data);
        const lockRes = await collateralSystem.userLockedData(
            account,
            ethers.utils.formatBytes32String(token),
        );
        const lockData = parseFloat(ethers.utils.formatEther(lockRes));
        return {
            collateral: data,
            inUSD: collateralInUSD,
            locked: lockData,
        };
    };

    const getDebtInfo = async () => {
        const tokens = COLLATERAL_TOKENS.map((token) => token.name);
        const res = await Promise.all(
            tokens.map((token) => getCollateralDataByToken(account, token)),
        );

        const total = res.reduce((total, item, i) => {
            return total + item.inUSD;
        }, 0);

        const totalLocked = res.reduce((total, item) => {
            return total + item.locked;
        }, 0);
        // setLockedData({
        //     ...lockedData,
        //     startValue: totalLocked,
        //     endValue: totalLocked,
        // });
        const infos = res.map((item, index) => {
            const ratioValue =
                total > 0 ? Number((100 * item.inUSD) / total).toFixed(2) : 0;
            return {
                collateralToken: tokens[index],
                ratio: ratioValue + '%',
                ratioValue,
                debt: item.collateral,
                locked: item.locked,
            } as IDebtItemInfo;
        });
        infos.sort((a, b) => Number(b.ratioValue) - Number(a.ratioValue));
        setDebtItemInfos(infos);
        setSelectedDebtItemInfos(infos);
    };

    const refreshData = () => {
        if (account) {
            getDebtInUSD();
            getDebtInfo();
        }
    };

    useEffect(() => {
        if (account) {
            refreshData();
        }
    }, [account, provider]); //fixme: provider 不是metask时合约接口会报错。

    return (
        <div className="debt-item">
            <div className="debt-item-head">
                <div className="debt-token">
                    <TokenIcon size={36} name={mintedToken} />
                    <div className="token-minted">
                        <span>{mintedToken}</span>
                        <span>{mintedTokenNum}</span>
                    </div>
                </div>
                <div
                    className={`debt-in-usd ${
                        showInfos ? 'show-infos' : 'hide-infos'
                    }`}
                    onClick={() => setShowInfos(!showInfos)}
                >
                    <p>${fusdBalance}</p>
                    <img src={IconDown} />
                </div>
            </div>
            <div className="content-box">
                {!showInfos && <DebtInfoSimple infos={debtItemInfos} />}
                {showInfos && <DebtInfoDetail infos={debtItemInfos} />}
            </div>
        </div>
    );
};
