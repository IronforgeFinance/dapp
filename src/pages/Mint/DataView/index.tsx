import React from 'react';
import './index.less';
import { useModel } from 'umi';
import ProgressBar from '@/components/ProgressBar';
import useDataView from '@/hooks/useDataView';
export default () => {
    const { stakedData, lockedData, debtData, fRatioData } = useModel(
        'dataView',
        (model) => ({
            ...model,
        }),
    );

    useDataView('BTC');

    return (
        <div className="data-view-container">
            <ProgressBar {...stakedData} />
            <ProgressBar {...lockedData} />
            <ProgressBar {...debtData} />
            <ProgressBar {...fRatioData} />
        </div>
    );
};
