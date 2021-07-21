import { IDebtItemInfo } from '../pages/Burn/components/DebtItem/index';
import { useState, useEffect } from 'react';

const initData = {};

const useBurnDataModel = () => {
    const [selectedDebtInfos, setSelectedDebtInfos] = useState<IDebtItemInfo[]>(
        [],
    );
    const [selectedDebtInUSD, setSelectedDebtInUSD] = useState(0.0);
    useEffect(() => {}, []);
    return {
        selectedDebtInfos,
        setSelectedDebtInfos,
        selectedDebtInUSD,
        setSelectedDebtInUSD,
    };
};

export default useBurnDataModel;
