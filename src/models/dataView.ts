import { useState, useEffect, useCallback } from 'react';
import { IProgressBarProps } from '@/components/ProgressBar';
import { ProgressBarType } from '@/config/constants/types';
import { IDebtItemInfo } from '../pages/Burn/components/DebtItem/index';

import { useWeb3React } from '@web3-react/core';

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
const useDataViewModel = () => {
    const { account } = useWeb3React();
    const [stakedData, setStakedData] = useState<IProgressBarProps>(
        testData[0],
    );
    const [lockedData, setLockedData] = useState<IProgressBarProps>(
        testData[1],
    );
    const [debtData, setDebtData] = useState<IProgressBarProps>(testData[2]);
    const [fRatioData, setfRatioData] = useState<IProgressBarProps>(
        testData[3],
    );

    const [selectedDebtInfos, setSelectedDebtInfos] = useState<IDebtItemInfo[]>(
        [],
    );
    const [selectedDebtInUSD, setSelectedDebtInUSD] = useState(0.0);

    const clearDataView = () => {
        setStakedData(testData[0]);
        setLockedData(testData[1]);
        setDebtData(testData[2]);
        setfRatioData(testData[3]);
    };

    // plugin-model 是umi提升到全局的状态，与根组件同级，不能响应异步的account的获取，
    // 因此这里用useEffect 异步获取数据不生效。
    // 仅做全局静态数据维护

    return {
        stakedData,
        setStakedData,
        lockedData,
        setLockedData,
        debtData,
        setDebtData,
        fRatioData,
        setfRatioData,
        selectedDebtInfos,
        setSelectedDebtInfos,
        selectedDebtInUSD,
        setSelectedDebtInUSD,
        clearDataView,
    };
};

export default useDataViewModel;
