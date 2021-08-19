import React, { useMemo } from 'react';
import './index.less';
import { ProgressBarType } from '@/config/constants/types';
import classnames from 'classnames';
import { toFixedWithoutRound } from '@/utils/bigNumber';

export type StatusType = 'unconnect' | 'trading' | 'default';

export interface IProgressBarProps {
    type: ProgressBarType;
    name: string | React.ReactNode;
    startValue: number;
    endValue: number;
    unit: '$' | '%';
    token?: string;
    tokenAmount?: number;
    status?: StatusType;
}

const ProgressBar = (props: IProgressBarProps) => {
    const {
        type,
        name,
        startValue,
        endValue,
        unit,
        status,
        token,
        tokenAmount,
    } = props;

    const progress = useMemo(() => {
        if (status === 'unconnect') {
            return 0;
        }

        if (type === ProgressBarType.f_ratio) {
            return (endValue / startValue) * 100;
        } else {
            if (startValue !== 0 && endValue !== 0 && startValue !== endValue) {
                if (startValue + endValue < 0) {
                    return 100;
                }
                return (endValue / (startValue + endValue)) * 100;
            } else if (startValue === 0 && endValue !== 0) {
                return 100;
            } else {
                return 0;
            }
        }
        // return 50; // 调试效果
    }, [type, startValue, endValue, status]);

    const barStyle = useMemo((): React.CSSProperties => {
        return {
            opacity: status === 'default' ? 1 : 0.7,
        };
    }, [status]);

    return (
        <div className="progress-bar-container">
            <div
                className={classnames({
                    'left-bg': true,
                    'bg-icon-axe': type === ProgressBarType.staked,
                    'bg-icon-lock': type === ProgressBarType.locked_ftoken,
                    'bg-icon-coin': type === ProgressBarType.active_debt,
                    'bg-icon-magic-bottle': type === ProgressBarType.f_ratio,
                })}
            ></div>
            <div className="progress-content">
                <p className="progress-name">{name}</p>
                <div className="progress-bar" style={barStyle}>
                    <div className="progress-bar-bg">
                        <div
                            className={classnames({
                                'current-progress': true,
                                'current-progress-revert':
                                    type === ProgressBarType.f_ratio,
                            })}
                            style={{ width: progress + '%' }}
                        ></div>
                    </div>
                </div>
                <div className="info">
                    {type === ProgressBarType.f_ratio && (
                        <>
                            <span className="end-value">
                                {endValue}
                                {unit}
                            </span>
                            <span className=" icon-arrow icon-arrow-left"></span>
                            <span className="start-value">
                                {startValue}
                                {unit}
                            </span>
                        </>
                    )}
                    {type !== ProgressBarType.f_ratio && (
                        <>
                            <span className="start-value">
                                {unit}
                                {startValue}
                            </span>
                            <span className="icon-arrow"></span>
                            <span className="end-value">
                                {unit}
                                {endValue}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

ProgressBar.defaultProps = {
    status: 'unconnect' as StatusType,
};

export default ProgressBar;
