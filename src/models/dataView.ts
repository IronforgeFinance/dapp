import { useState, useEffect } from 'react';
import { IProgressBarProps } from '@/components/ProgressBar';
import { ProgressBarType } from '@/config/constants/types';

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
    const [stakedData, setStakedData] = useState<IProgressBarProps>(
        testData[0],
    );
    const [lockedData, setLockedData] = useState<IProgressBarProps>(
        testData[1],
    );
    const [debtData, setDebtData] = useState<IProgressBarProps>(testData[2]);
    const [fRatioData, setfRadioData] = useState<IProgressBarProps>(
        testData[3],
    );

    useEffect(() => {
        return () => {};
    }, []);

    return {
        stakedData,
        setStakedData,
        lockedData,
        setLockedData,
        debtData,
        setDebtData,
        fRatioData,
        setfRadioData,
    };
};

export default useDataViewModel;
