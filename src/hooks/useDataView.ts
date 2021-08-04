import { useWeb3React } from '@web3-react/core';
import React, { useState, useEffect } from 'react';
import { IProgressBarProps } from '@/components/ProgressBar';
import { ProgressBarType } from '@/config/constants/types';
import { IDebtItemInfo } from '../pages/Burn/components/DebtItem/index';
import {
    useDebtSystem,
    useCollateralSystem,
    useLiquidation,
    usePrices,
    useConfig,
} from '@/hooks/useContract';
import { ethers } from 'ethers';
import { TokenPrices } from '@/config';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import useRefresh from './useRefresh';
import { COLLATERAL_TOKENS } from '@/config';
import { useModel } from 'umi';
import { useInitialRatio } from '@/hooks/useConfig';
const testData = [
    {
        type: ProgressBarType.staked,
        name: 'Staked',
        startValue: 0,
        endValue: 0,
        unit: '$',
    },
    {
        type: ProgressBarType.locked_ftoken,
        name: 'Locked fToken',
        startValue: 0,
        endValue: 0,
        unit: '$',
    },
    {
        type: ProgressBarType.active_debt,
        name: 'Active Debt',
        startValue: 0.0,
        endValue: 0.0,
        unit: '$',
    },
    {
        type: ProgressBarType.f_ratio,
        name: 'F-Ratio',
        startValue: 0,
        endValue: 0,
        unit: '%',
    },
] as IProgressBarProps[];

// 用于异步获取数据
const useDataView = (currency: string) => {
    const {
        stakedData,
        lockedData,
        debtData,
        fRatioData,
        setStakedData: setStakedDataInModel,
        setLockedData: setLockedDataInModel,
        setDebtData: setDebtDataInModel,
        setfRatioData: setfRatioDataInModel,
    } = useModel('dataView', (model) => ({
        ...model,
    }));
    const [currencyRatio, setCurrencyRatio] = useState(0); //TODO 初始质押率;
    const { account } = useWeb3React();
    const { fastRefresh } = useRefresh();
    const collateralSystem = useCollateralSystem();
    const liquidation = useLiquidation();
    const debtSystem = useDebtSystem();
    const provider = useWeb3Provider();

    const initialRatio = useInitialRatio(currency);

    const fetchStakedData = async () => {
        if (account) {
            const res = await collateralSystem.getUserCollateralInUsd(
                account,
                ethers.utils.formatBytes32String(currency),
            );
            const amount = parseFloat(ethers.utils.formatUnits(res, 18));
            console.log('getUserCollateralInUsd', amount);
            const newVal = {
                ...stakedData,
                token: currency,
                startValue: amount,
                endValue: amount,
            };
            setStakedDataInModel(newVal);
        }
    };
    const fetchLockedData = async () => {};
    const fetchDebtData = async () => {
        // const res = await Promise.all(
        //     COLLATERAL_TOKENS.map((token) =>
        //         debtSystem.GetUserDebtBalanceInUsd(
        //             account,
        //             ethers.utils.formatBytes32String(token.name),
        //         ),
        //     ),
        // );

        // const totalDebtInUsd = res.reduce((total, item) => {
        //     const val = parseFloat(ethers.utils.formatUnits(item[0], 18));
        //     total += val;
        //     return total;
        // }, 0);
        const res = await debtSystem.GetUserDebtBalanceInUsd(
            account,
            ethers.utils.formatBytes32String(currency),
        );
        const debt = parseFloat(ethers.utils.formatUnits(res[0], 18));
        const newVal = {
            ...debtData,
            startValue: debt,
            endValue: debt,
        };
        setDebtDataInModel(newVal);
    };

    const fetchCurrencyRatio = async () => {
        if (currency) {
            //TODO 替换为collateralSystem.getRatio 方法。还没部署。
            const res = await liquidation.evalUserPosition(
                account,
                ethers.utils.formatBytes32String(currency),
            );
            const val = res.collateralizedRatio.isZero()
                ? 0
                : 1 /
                  Number(ethers.utils.formatUnits(res.collateralizedRatio, 18));
            console.log(
                'fetchCurrencyRatio: ',
                res.collateralizedRatio.toString(),
                val,
            );
            const newVal = {
                ...fRatioData,
                startValue: val * 100,
                endValue: initialRatio * 100,
            };
            setfRatioDataInModel(newVal);
            setCurrencyRatio(val);
            return val;
        }
        return 0;
    };
    useEffect(() => {
        if (account && currency) {
            fetchStakedData();
            fetchDebtData();
        }
    }, [account, currency, fastRefresh, provider]);

    useEffect(() => {
        if (currency) {
            fetchCurrencyRatio();
        }
    }, [currency, account, fastRefresh, provider, initialRatio]);
    return { stakedData, fetchStakedData, currencyRatio };
};

export const useSelectedDebtInUSD = (currency: string) => {
    const [debt, setDebt] = useState(0);
    const debtSystem = useDebtSystem();
    const { account } = useWeb3React();

    useEffect(() => {
        if (currency && account) {
            (async () => {
                const res = await debtSystem.GetUserDebtBalanceInUsd(
                    account,
                    ethers.utils.formatBytes32String(currency),
                );
                if (res && res[0]) {
                    const val = parseFloat(
                        ethers.utils.formatUnits(res[0], 18),
                    );
                    setDebt(val);
                    console.log('useSelectedDebtInUSD: ', val);
                }
            })();
        }
    }, [currency, account]);
    return debt;
};

export default useDataView;
