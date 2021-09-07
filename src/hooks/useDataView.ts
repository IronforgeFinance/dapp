import { useWeb3React } from '@web3-react/core';
import React, { useState, useEffect } from 'react';
import { IProgressBarProps } from '@/components/ProgressBar';
import { ProgressBarType } from '@/config/constants/types';
import { IDebtItemInfo } from '../pages/Burn/components/DebtItem/index';
import {
    useDebtSystem,
    useCollateralSystem,
    usePrices,
    useConfig,
} from '@/hooks/useContract';
import { ethers } from 'ethers';
import { PLATFORM_TOKEN } from '@/config';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import useRefresh from './useRefresh';
import { COLLATERAL_TOKENS } from '@/config';
import { useModel } from 'umi';
import { useInitialRatio } from '@/hooks/useConfig';
import { getTokenPrice } from '@/utils';
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
    const debtSystem = useDebtSystem();
    const provider = useWeb3Provider();

    const initialRatio = useInitialRatio(currency);

    const prices = usePrices();

    const fetchStakedData = async () => {
        if (account) {
            try {
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
            } catch (err) {
                console.log(err);
            }
        }
    };
    const fetchLockedData = async () => {
        try {
            const res = await collateralSystem.userLockedData(
                account,
                ethers.utils.formatBytes32String(currency),
            );
            const data = parseFloat(ethers.utils.formatEther(res));
            console.log('fetchLockedData: ', data);
            const price = await getTokenPrice(PLATFORM_TOKEN);
            const newVal = {
                ...lockedData,
                startValue: data * price,
                endValue: data * price,
            };
            setLockedDataInModel(newVal);
        } catch (err) {
            console.log(err);
        }
    };
    const fetchDebtData = async () => {
        try {
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
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCurrencyRatio = async () => {
        if (currency) {
            try {
                const res = await collateralSystem.getRatio(
                    account,
                    ethers.utils.formatBytes32String(currency),
                );
                const resVal = res.map((item) =>
                    ethers.utils.formatEther(item),
                );
                console.log('getRatio: ', resVal);
                const _val = Number(resVal[0]) === 0 ? 0 : 1 / Number(res[0]);

                const val = toFixedWithoutRound(_val, 6); // 保留多位精度
                const ratioData = parseFloat((val * 100).toFixed(2));
                console.log('fetchCurrencyRatio: ', val, resVal);
                const newVal = {
                    ...fRatioData,
                    startValue: ratioData,
                    endValue: ratioData,
                };
                setfRatioDataInModel(newVal);
                setCurrencyRatio(val);
                return val;
            } catch (err) {
                console.log(err);
            }
        }
        return 0;
    };
    useEffect(() => {
        if (account && currency) {
            fetchStakedData();
            fetchDebtData();
            fetchLockedData();
        }
    }, [account, currency, provider]);

    useEffect(() => {
        if (currency && account) {
            fetchCurrencyRatio();
        }
    }, [currency, account, provider, initialRatio]);
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
