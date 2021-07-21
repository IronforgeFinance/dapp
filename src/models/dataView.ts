import { useState, useEffect, useCallback } from 'react';
import { IProgressBarProps } from '@/components/ProgressBar';
import { ProgressBarType } from '@/config/constants/types';
import { IDebtItemInfo } from '../pages/Burn/components/DebtItem/index';

import { useWeb3React } from '@web3-react/core';
import { useDebtSystem, useCollateralSystem } from '@/hooks/useContract';
import { ethers } from 'ethers';
import { TokenPrices } from '@/config';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import useWeb3Provider from '@/hooks/useWeb3Provider';

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

    const [selectedDebtInfos, setSelectedDebtInfos] = useState<IDebtItemInfo[]>(
        [],
    );
    const [selectedDebtInUSD, setSelectedDebtInUSD] = useState(0.0);

    return {
        stakedData,
        setStakedData,
        lockedData,
        setLockedData,
        debtData,
        setDebtData,
        fRatioData,
        setfRadioData,
        selectedDebtInfos,
        setSelectedDebtInfos,
        selectedDebtInUSD,
        setSelectedDebtInUSD,
    };
};

export default useDataViewModel;
