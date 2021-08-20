import React from 'react';
import './index.less';
import { notification } from 'antd';
import LinkSvg from '@/assets/images/link.svg';
import NotifySuccessSvg from '@/assets/images/notify-success.svg';
import NotifyFailSvg from '@/assets/images/notify-fail.svg';
import styled, { keyframes } from 'styled-components';

const DEFAULT_DURATION = 5;

const DEFAULT_SUCCESS_MESSAGE = '提示';

const DEFAULT_FAIL_MESSAGE = '错误';

interface Notification {
    message?: string;
    description: string;
    duration?: number;
}

interface SuccessProps extends Notification {
    showView?: boolean;
    view?: React.ReactNode;
    viewLink?: string;
}

interface FailProps extends Notification {}

function instanceOfSuccessProps(object: any): object is SuccessProps {
    if (typeof object !== 'object') return false;
    return 'description' in object;
}

function instanceOfFailProps(object: any): object is FailProps {
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

export const success = (props: string | SuccessProps) => {
    if (typeof props === 'string') {
        notification.success({
            duration: DEFAULT_DURATION,
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
        const {
            message,
            description,
            view: ViewNode,
            showView,
            viewLink,
            duration,
        } = props;

        notification.success({
            duration: duration || DEFAULT_DURATION,
            className: 'iron-notification success',
            message: <h3>{message || DEFAULT_SUCCESS_MESSAGE}</h3>,
            description: (
                <React.Fragment>
                    <div className="description">
                        <p>{description}</p>
                        {showView &&
                            (ViewNode || (
                                <a
                                    onClick={() =>
                                        (window.location.href = viewLink)
                                    }
                                >
                                    View on Bscscan
                                    <img src={LinkSvg} />
                                </a>
                            ))}
                    </div>
                    <TimerBar duration={duration || DEFAULT_DURATION} />
                </React.Fragment>
            ),
            icon: <img className="icon-status" src={NotifySuccessSvg} />,
            closeIcon: <i className="icon-close" />,
        });
    }
};

export const fail = (props: string | FailProps) => {
    if (typeof props === 'string') {
        notification.error({
            duration: DEFAULT_DURATION,
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

export const info = success;

export const error = fail;

export const warning = fail;

export default {
    info,
    error,
    warning,
    fail,
    success,
};
