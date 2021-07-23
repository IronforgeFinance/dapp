import { useWeb3React } from '@web3-react/core';
import React, { useState, useEffect } from 'react';
import { IProgressBarProps } from '@/components/ProgressBar';
import { ProgressBarType } from '@/config/constants/types';
import { IDebtItemInfo } from '../pages/Burn/components/DebtItem/index';
import { useDebtSystem, useCollateralSystem } from '@/hooks/useContract';
import { ethers } from 'ethers';
import { TokenPrices } from '@/config';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import useRefresh from './useRefresh';
import { useModel } from 'umi';
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
const useDataView = () => {
    const {
        stakedData,
        lockedData,
        debtData,
        setStakedData: setStakedDataInModel,
        setLockedData: setLockedDataInModel,
        setDebtData: setDebtDataInModel,
    } = useModel('dataView', (model) => ({
        ...model,
    }));
    const { account } = useWeb3React();
    const { fastRefresh } = useRefresh();
    const collateralSystem = useCollateralSystem();
    const debtSystem = useDebtSystem();
    const provider = useWeb3Provider();

    const fetchStakedData = async () => {
        if (account) {
            const res = await collateralSystem.getUserTotalCollateralInUsd(
                account,
            );
            console.log('getUserTotalCollateralInUsd', res);
            const amount = parseFloat(ethers.utils.formatUnits(res, 18));
            const newVal = {
                ...stakedData,
                startValue: amount,
                endValue: stakedData.endValue || amount,
            };
            setStakedDataInModel(newVal);
        }
    };
    const fetchLockedData = async () => {};
    const fetchDebtData = async () => {
        const res = await debtSystem.GetUserDebtBalanceInUsd(account);
        const amount = res.map((item) =>
            parseFloat(ethers.utils.formatUnits(item, 18)).toFixed(2),
        );
        if (amount && amount[0]) {
            const value = parseFloat(amount[0]);
            const newVal = {
                ...debtData,
                startValue: value,
                endValue: debtData.endValue || value,
            };
            setDebtDataInModel(newVal);
        }
    };
    useEffect(() => {
        if (account) {
            fetchStakedData();
            fetchDebtData();
        }
    }, [account, fastRefresh, provider]);
    return { stakedData, fetchStakedData };
};

export default useDataView;
