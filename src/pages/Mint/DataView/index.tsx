import React from 'react';
import './index.less';
import { useModel } from 'umi';
import ProgressBar from '@/components/ProgressBar';
export default () => {
    const {
        stakedData,
        setStakedData,
        lockedData,
        setLockedData,
        debtData,
        setDebtData,
        fRatioData,
        setfRadioData,
    } = useModel('dataView', (model) => ({
        ...model,
    }));

    return (
        <div className="data-view-container">
            <ProgressBar {...stakedData} />
            <ProgressBar {...lockedData} />
            <ProgressBar {...debtData} />
            <ProgressBar {...fRatioData} />
        </div>
    );
};
