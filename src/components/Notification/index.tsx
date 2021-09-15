import './less/index.less';

import React from 'react';
import { notification } from 'antd';
import LinkSvg from '@/assets/images/link.svg';
import NotifySuccessSvg from '@/assets/images/notify-success.svg';
import NotifyFailSvg from '@/assets/images/notify-fail.svg';
import NotifyLoadingSvg from '@/assets/images/notify-loading.svg';
import styled, { keyframes } from 'styled-components';

const DEFAULT_DURATION = 5;

const DEFAULT_SUCCESS_MESSAGE = '提示';

const DEFAULT_FAIL_MESSAGE = '错误';

const DEFAULT_LOADING_MESSAGE = 'Waiting for Transaction Submitted...';

interface Notification {
    message?: string;
    description: string;
    duration?: number;
    hide?(): void;
}

interface SuccessProps extends Notification {
    scan?(): void;
    scanHref?: string;
}

interface FailProps extends Notification {}

interface LoadingProps extends Notification {
    scale?(): void;
    revert?(): void;
}

function instanceOfSuccessProps(object: any): object is SuccessProps {
    if (typeof object !== 'object') return false;
    return 'description' in object;
}

function instanceOfFailProps(object: any): object is FailProps {
    if (typeof object !== 'object') return false;
    return 'description' in object;
}

function instanceOfLoadingProps(object: any): object is LoadingProps {
    if (typeof object !== 'object') return false;
    return 'description' in object;
}

interface TimerBarProps {
    duration: number;
}

const TimerBar = function (props: TimerBarProps) {
    const ITimerBar = styled.div`
        position: absolute;
        left: 0;
        right: 20px;
        bottom: 0;
        background: #a762ff;
        height: 5px;
        animation: ${keyframes`
            0% { width: 100%; }
            100% { width: 0%; }
        `} ${props.duration}s linear 1 forwards;
    `;

    return <ITimerBar />;
};

export const success = (props: string | SuccessProps, duration?: number) => {
    if (typeof props === 'string') {
        notification.success({
            duration: duration || DEFAULT_DURATION,
            className: 'iron-notification success',
            message: <h3>{DEFAULT_SUCCESS_MESSAGE}</h3>,
            description: (
                <React.Fragment>
                    <div className="description">
                        <p>{props}</p>
                    </div>
                    <TimerBar duration={DEFAULT_DURATION} />
                </React.Fragment>
            ),
            icon: <img className="icon-status" src={NotifySuccessSvg} />,
            closeIcon: <i className="icon-close" />,
        });
    }

    if (instanceOfSuccessProps(props)) {
        const { message, description, scan, duration, scanHref } = props;

        notification.success({
            duration: duration || DEFAULT_DURATION,
            className: 'iron-notification success',
            message: <h3>{message || DEFAULT_SUCCESS_MESSAGE}</h3>,
            description: (
                <React.Fragment>
                    <div className="description">
                        <p>{description}</p>
                        {(scan || scanHref) && (
                            <a onClick={scan} href={scanHref} target="_blank">
                                View on Bscscan
                                <img src={LinkSvg} />
                            </a>
                        )}
                    </div>
                    <TimerBar duration={duration || DEFAULT_DURATION} />
                </React.Fragment>
            ),
            icon: <img className="icon-status" src={NotifySuccessSvg} />,
            closeIcon: <i className="icon-close" />,
        });
    }
};

export const fail = (props: string | FailProps, duration?: number) => {
    if (typeof props === 'string') {
        notification.error({
            duration: duration || DEFAULT_DURATION,
            className: 'iron-notification fail',
            message: <h3>{DEFAULT_FAIL_MESSAGE}</h3>,
            description: (
                <React.Fragment>
                    <div className="description">
                        <p>{props}</p>
                    </div>
                    <TimerBar duration={DEFAULT_DURATION} />
                </React.Fragment>
            ),
            icon: <img className="icon-status" src={NotifyFailSvg} />,
            closeIcon: <i className="icon-close" />,
        });
    }

    if (instanceOfFailProps(props)) {
        const { message, description, duration } = props;

        notification.error({
            duration: duration || DEFAULT_DURATION,
            className: 'iron-notification fail',
            message: <h3>{message || DEFAULT_FAIL_MESSAGE}</h3>,
            description: (
                <React.Fragment>
                    <div className="description">
                        <p>{description}</p>
                    </div>
                    <TimerBar duration={duration || DEFAULT_DURATION} />
                </React.Fragment>
            ),
            icon: <img className="icon-status" src={NotifyFailSvg} />,
            closeIcon: <i className="icon-close" />,
        });
    }
};

export let loading = (props: string | LoadingProps) => {
    const key = String(Date.now());

    if (instanceOfLoadingProps(props)) {
        const { message, description, scale, revert } = props;

        notification.error({
            key,
            duration: 0,
            className: 'iron-notification loading',
            message: <h3>{message || DEFAULT_LOADING_MESSAGE}</h3>,
            description: (
                <React.Fragment>
                    <div className="description">
                        <p>{description}</p>
                        {scale && (
                            <button className="scale-btn" onClick={scale} />
                        )}
                        <span className="status">Pending</span>
                        {revert && (
                            <a className="revert-btn" onClick={revert}>
                                Revert
                            </a>
                        )}
                    </div>
                </React.Fragment>
            ),
            icon: (
                <img className="icon-status loading" src={NotifyLoadingSvg} />
            ),
            closeIcon: <i className="icon-close" />,
        });
    }

    return () => notification.close(key);
};

export const info = success;

export const error = fail;

export const warning = fail;

export default {
    info,
    error,
    warning,
    fail,
    success,
    loading,
};
