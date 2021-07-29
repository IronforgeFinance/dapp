import React, { useState, useEffect, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useDebtSystem, useCollateralSystem } from '@/hooks/useContract';
import { ethers } from 'ethers';
import { TokenPrices } from '@/config';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import './index.less';
import IconDown from '@/assets/images/down.svg';
import DebtInfoDetail from './DebtInfoDetail';
import DebtInfoSimple from './SimpleDebtInfo';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import { useModel } from 'umi';
import { COLLATERAL_TOKENS } from '@/config';
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

export default (IDebtItemProps) => {
    const { mintedToken, mintedTokenName } = IDebtItemProps;
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

    const mintedTokenNum = useMemo(() => {
        if (Number(selectedDebtInUSD) > 0) {
            const price = TokenPrices[mintedToken];
            const num = toFixedWithoutRound(selectedDebtInUSD / price, 2);
            return num;
        }
        return 0.0;
    }, [selectedDebtInUSD]);

    const { balance: fusdBalance } = useBep20Balance('FUSD');

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
        console.log('getDebtInUSD: ', totalDebtInUsd);
        setSelectedDebtInUSD(totalDebtInUsd);
    };

    const getCollateralDataByToken = async (account, token) => {
        const res = await collateralSystem.getUserCollateral(
            account,
            ethers.utils.formatBytes32String(token),
        );
        const data = parseFloat(ethers.utils.formatUnits(res, 18));
        console.log('getCollateralData: ', token, data);
        return data;
    };

    const getDebtInfo = async () => {
        const tokens = COLLATERAL_TOKENS.map((token) => token.name);
        const res = await Promise.all(
            tokens.map((token) => getCollateralDataByToken(account, token)),
        );

        const total = res.reduce((total, item, i) => {
            const price = TokenPrices[tokens[i]];
            return total + item * price;
        }, 0);
        const infos = res.map((item, index) => {
            const price = TokenPrices[tokens[index]];
            const ratioValue = Number((100 * (item * price)) / total).toFixed(
                2,
            );
            return {
                collateralToken: tokens[index],
                ratio: ratioValue + '%',
                ratioValue,
                debt: item,
                locked: 0, // 目前locked都是0
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
        <div className="debt-item-container">
            <div className="debt-item-head">
                <div className="debt-token">
                    <div className={`token-name token-${mintedToken}`}>
                        {mintedTokenName}
                    </div>
                    <div className="token-minted">
                        <span>{mintedToken}</span>
                        <span>{mintedTokenNum}</span>
                    </div>
                </div>
                <div
                    className="debt-in-usd"
                    onClick={() => setShowInfos(!showInfos)}
                >
                    <p>Balance: ${fusdBalance}</p>
                    <img src={IconDown} alt="" />
                </div>
            </div>
            <div className="content-box">
                {!showInfos && <DebtInfoSimple infos={debtItemInfos} />}
                {showInfos && <DebtInfoDetail infos={debtItemInfos} />}
            </div>
        </div>
    );
};
