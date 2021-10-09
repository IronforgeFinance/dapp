import { useState, useEffect } from 'react';

const initData = {};

export interface IDebtItemInfo {
    collateralToken: string;
    ratio: string;
    ratioValue: number | string;
    collateral: number;
    locked: number;
}

const useBurnDataModel = () => {
    const [debtItemInfos, setDebtItemInfos] = useState<IDebtItemInfo[]>(
        [],
    );
    const [totalDebtInUSD, setTotalDebtInUSD] = useState(0);
    useEffect(() => {}, []);
    return {
        debtItemInfos, 
        setDebtItemInfos,
        totalDebtInUSD,
        setTotalDebtInUSD,
    };
};

export default useBurnDataModel;
