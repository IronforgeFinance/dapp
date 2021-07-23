import React, { useMemo } from 'react';
import './index.less';
import { ProgressBarType } from '@/config/constants/types';
import classnames from 'classnames';
export interface IProgressBarProps {
    type: ProgressBarType;
    name: string;
    startValue: number;
    endValue: number;
    unit: '$' | '%';
}
export default (props: IProgressBarProps) => {
    const { type, name, startValue, endValue, unit } = props;

    const progress = useMemo(() => {
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
    }, [type, startValue, endValue]);

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
                <div className="progress-bar">
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
                            <span className="start-value">
                                {endValue}
                                {unit}
                            </span>
                            <span className=" icon-arrow icon-arrow-left"></span>
                            <span className="end-value">
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
