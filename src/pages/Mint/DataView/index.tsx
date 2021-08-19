import React from 'react';
import './index.less';
import { Popover } from 'antd';
import { useModel } from 'umi';
import { useWeb3React } from '@web3-react/core';
import ProgressBar from '@/components/ProgressBar';

export default () => {
    const { stakedData, lockedData, debtData, fRatioData } = useModel(
        'dataView',
        (model) => ({
            ...model,
        }),
    );

    const { account } = useWeb3React();

    const loginStatus = React.useMemo(
        () => (account ? 'default' : 'unconnect'),
        [account],
    );

    return (
        <div className="data-view-container">
            <ProgressBar {...stakedData} status={loginStatus} />
            <ProgressBar {...lockedData} status={loginStatus} />
            <ProgressBar {...debtData} status={loginStatus} />
            <ProgressBar
                {...fRatioData}
                status={loginStatus}
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
