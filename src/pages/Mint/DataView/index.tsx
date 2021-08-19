import React from 'react';
import './index.less';
import { Popover } from 'antd';
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

    return (
        <div className="data-view-container">
            <ProgressBar {...stakedData} />
            <ProgressBar {...lockedData} />
            <ProgressBar {...debtData} />
            <ProgressBar
                {...fRatioData}
                name={
                    <React.Fragment>
                        <span>{fRatioData.name}</span>
                        <Popover
                            placement="topLeft"
                            content="这是一段解释f-ratio变化规则的文字"
                            trigger="hover"
                        >
                            <i className="icon-question size-16 ml-8" />
                        </Popover>
                    </React.Fragment>
                }
            />
        </div>
    );
};
