import './pc.less';
import './mobile.less';

import React, { useMemo, useState } from 'react';
import { ProgressBarType } from '@/config/constants/types';
import { Popover } from 'antd';
import classnames from 'classnames';
import { useIntl } from 'umi';
import { useEffect } from 'react';
import classNames from 'classnames';

export type StatusType = 'unconnect' | 'trading' | 'done' | 'default';

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

export interface RatioViewProps {
    currentRatio?: number | string;
    initialRatio?: number | string;
}

const RatioView = (props: RatioViewProps) => {
    const { initialRatio = 0, currentRatio = 0 } = props;
    const intl = useIntl();

    return (
        <ul className="popover-ratios">
            <li className="current">
                {intl.formatMessage({ id: 'assetsbar.fratio.current' })}
                {currentRatio}
            </li>
            <li className="initial">
                {intl.formatMessage({ id: 'assetsbar.fratio.initial' })}
                {initialRatio}
            </li>
        </ul>
    );
};

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
    const [stakeRatioInitial, setStakeRatioInitial] = useState(0);

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

    // * 初始过程的质押率计算
    const isStakeRatioInitial = useMemo(
        () => startValue === 0 && type === 'f_ratio',
        [type, startValue],
    );
    useEffect(() => {
        if (!stakeRatioInitial && isStakeRatioInitial) {
            setStakeRatioInitial(endValue);
        }
    }, [isStakeRatioInitial, endValue]);
    const initialRatio = useMemo(() => {
        if (isStakeRatioInitial) {
            return 0;
        }

        return startValue > 0 ? 50 : 0;
    }, [startValue, isStakeRatioInitial]);
    const increment: number = useMemo(() => {
        if (isStakeRatioInitial) {
            return endValue - stakeRatioInitial;
        }

        return endValue - startValue;
    }, [endValue, startValue, isStakeRatioInitial, stakeRatioInitial]);
    const isTrading = useMemo(() => increment !== 0, [increment]);
    const currentRatio = useMemo(() => {
        if (isStakeRatioInitial) {
            return isTrading
                ? 50 + (increment / (stakeRatioInitial || 1)) * 50
                : 0;
        }

        return isTrading ? 50 + (increment / (startValue || 1)) * 50 : 0;
    }, [increment, startValue, stakeRatioInitial]);
    const isRaised = useMemo(
        () => initialRatio < currentRatio,
        [initialRatio, currentRatio],
    );
    const barStyle = useMemo(
        (): React.CSSProperties => ({
            opacity: isTrading
                ? status === 'done'
                    ? 1
                    : 0.7
                : status === 'default'
                ? 1
                : 0.7,
        }),
        [status, isTrading],
    );

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
                {type === 'f_ratio' && (
                    <Popover
                        placement="rightBottom"
                        content={
                            <RatioView
                                initialRatio={`${startValue}%`}
                                currentRatio={`${endValue}%`}
                            />
                        }
                        trigger="hover"
                    >
                        <div className="progress-bar" style={barStyle}>
                            <div className="progress-bar-bg">
                                <div
                                    className={`initial-progress ${
                                        !isRaised && 'is-not-raised'
                                    }`}
                                    style={{
                                        width: initialRatio + '%',
                                        ...barStyle,
                                    }}
                                >
                                    <div className="move-bar" />
                                </div>
                                <div
                                    className={`current-progress ${
                                        isRaised && 'is-raised'
                                    }`}
                                    style={{ width: currentRatio + '%' }}
                                >
                                    <div className="move-bar" />
                                </div>
                            </div>
                        </div>
                    </Popover>
                )}
                {type !== 'f_ratio' && (
                    <div className="progress-bar" style={barStyle}>
                        <div className="progress-bar-bg">
                            <div
                                className={`initial-progress ${
                                    !isRaised && 'is-not-raised'
                                }`}
                                style={{
                                    width: initialRatio + '%',
                                    ...barStyle,
                                }}
                            >
                                <div className="move-bar" />
                            </div>
                            <div
                                className={`current-progress ${
                                    isRaised && 'is-raised'
                                }`}
                                style={{ width: currentRatio + '%' }}
                            >
                                <div className="move-bar" />
                            </div>
                        </div>
                    </div>
                )}
                <div className="info">
                    {isTrading && !isRaised && (
                        <React.Fragment>
                            <span
                                className={`end-value ${
                                    isRaised && 'is-raised'
                                }`}
                            >
                                {type === 'f_ratio'
                                    ? `${endValue}%`
                                    : `${unit}${endValue.toFixed(2)}`}
                            </span>
                            <span
                                className={`icon-arrow ${
                                    !isRaised && 'reverse'
                                }`}
                            />
                        </React.Fragment>
                    )}
                    <span
                        style={{ width: isTrading ? 'auto' : '100%' }}
                        className={classNames({
                            'start-value': true,
                            'is-raised': isRaised,
                            'is-ratio': type === 'f_ratio',
                        })}
                    >
                        {type === 'f_ratio'
                            ? `${
                                  isStakeRatioInitial
                                      ? stakeRatioInitial
                                      : startValue.toFixed(2)
                              }%`
                            : `${unit}${startValue.toFixed(2)}`}
                    </span>
                    {isTrading && isRaised && (
                        <React.Fragment>
                            <span className="icon-arrow" />
                            <span
                                className={`end-value ${
                                    isRaised && 'is-raised'
                                }`}
                            >
                                {type === 'f_ratio'
                                    ? `${endValue.toFixed(2)}%`
                                    : `${unit}${endValue.toFixed(2)}`}
                            </span>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    );
};

ProgressBar.defaultProps = {
    status: 'default' as StatusType,
};

export default ProgressBar;
