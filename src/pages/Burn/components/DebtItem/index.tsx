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
interface IDebtItemProps {
    mintedToken: string;
    mintedTokenName: string;
}

export interface IDebtItemInfo {
    collateralToken: string;
    ratio: string;
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

    const getDebtInUSD = async (account: string) => {
        console.log('account: ', account);
        let res = await debtSystem.GetUserDebtBalanceInUsd(account);
        res = res.map((item) => ethers.utils.formatUnits(item, 18));
        console.log('getDebtInUSD: ', res);
        if (res && res[0]) {
            // setDebtInUSD(res[0]) // [user'sdebt,total debt]
            // 取 余额和debt的最小值
            let debt = parseFloat(res[0]);
            if (fusdBalance) {
                debt = Math.min(debt, parseFloat(fusdBalance as string));
            }
            setSelectedDebtInUSD(debt);
        }
    };

    useEffect(() => {
        if (fusdBalance) {
            const debt = Math.min(
                selectedDebtInUSD,
                parseFloat(fusdBalance as string),
            );
            setSelectedDebtInUSD(debt);
        }
    }, [fusdBalance]);

    const getCollateralDataByToken = async (account, token) => {
        const res = await collateralSystem.getUserCollateral(
            account,
            ethers.utils.formatBytes32String(token),
        );
        const data = parseFloat(ethers.utils.formatUnits(res, 18));
        console.log('getCollateralData: ', token, data);
        return data;
    };

    const getDebtInfo = async (account: string, tokens: string[]) => {
        const res = await Promise.all(
            tokens.map((token) => getCollateralDataByToken(account, token)),
        );

        const total = res.reduce((total, item, i) => {
            const price = TokenPrices[tokens[i]];
            return total + item * price;
        }, 0);
        const infos = res.map((item, index) => {
            const price = TokenPrices[tokens[index]];
            const ratio =
                Number((100 * (item * price)) / total).toFixed(2) + '%';
            return {
                collateralToken: tokens[index],
                ratio,
                debt: item,
                locked: 0, // 目前locked都是0
            } as IDebtItemInfo;
        });
        setDebtItemInfos(infos);
        setSelectedDebtItemInfos(infos);
    };

    const refreshData = () => {
        if (account) {
            getDebtInUSD(account);
            const tokens = ['BTC'];
            getDebtInfo(account, tokens);
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
                    <p>${selectedDebtInUSD}</p>
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
