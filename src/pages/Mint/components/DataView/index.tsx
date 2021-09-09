import './less/index.less';

import React from 'react';
import { Popover } from 'antd';
import { useModel, useIntl } from 'umi';
import { useWeb3React } from '@web3-react/core';
import ProgressBar, { StatusType } from '@/components/ProgressBar';
import useEnv from '@/hooks/useEnv';

interface DataViewProps {
    status?: StatusType;
}

export default (props: DataViewProps) => {
    const intl = useIntl();
    const isMobile = useEnv();
    const { stakedData, lockedData, debtData, fRatioData } = useModel(
        'dataView',
        (model) => ({
            ...model,
        }),
    );
    const { status = 'default' } = props;

    const { account } = useWeb3React();

    const loginStatus = React.useMemo(
        () => (account ? status : 'unconnect'),
        [account],
    );

    return (
        <div className="data-view-container">
            <ProgressBar
                {...stakedData}
                name={intl.formatMessage({ id: 'assetsbar.staked' })}
                status={loginStatus}
            />
            <ProgressBar
                {...lockedData}
                name={intl.formatMessage({ id: 'assetsbar.lockedtoken' })}
                status={loginStatus}
            />
            <ProgressBar
                {...debtData}
                name={intl.formatMessage({ id: 'assetsbar.acitvedebt' })}
                status={loginStatus}
            />
            <ProgressBar
                {...fRatioData}
                status={loginStatus}
                name={
                    <React.Fragment>
                        <span>
                            {intl.formatMessage({ id: 'assetsbar.fratio' })}
                        </span>
                        <Popover
                            placement="topLeft"
                            content={intl.formatMessage({
                                id: 'assetsbar.fratio.desc',
                            })}
                            trigger="hover"
                        >
                            <i
                                className={`icon-question size-${
                                    isMobile ? 24 : 16
                                } ml-8`}
                            />
                        </Popover>
                    </React.Fragment>
                }
            />
        </div>
    );
};
