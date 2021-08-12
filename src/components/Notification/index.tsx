import React from 'react';
import './index.less';
import { notification } from 'antd';
import LinkSvg from '@/assets/images/link.svg';
import NotifySuccessSvg from '@/assets/images/notify-success.svg';
import NotifyFailSvg from '@/assets/images/notify-fail.svg';

const DEFAULT_DURATION = 5;

interface Notification {
    message: string;
    description: string;
    duration?: number;
}

interface SuccessProps extends Notification {
    showView?: boolean;
    view?: React.ReactNode;
    viewLink?: string;
}

interface FailProps extends Notification {}

export const success = (props: SuccessProps) => {
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
        className: 'icron-notification success',
        message: <h3>{message}</h3>,
        description: (
            <div className="description">
                <p>{description}</p>
                {showView &&
                    (ViewNode || (
                        <a onClick={() => (window.location.href = viewLink)}>
                            View on Bscscan
                            <img src={LinkSvg} />
                        </a>
                    ))}
            </div>
        ),
        icon: <img className="icon-status" src={NotifySuccessSvg} />,
        closeIcon: <i className="icon-close" />,
    });
};

export const fail = (props: FailProps) => {
    const { message, description, duration } = props;

    notification.error({
        duration: duration || DEFAULT_DURATION,
        className: 'icron-notification fail',
        message: <h3>{message}</h3>,
        description: (
            <div className="description">
                <p>{description}</p>
            </div>
        ),
        icon: <img className="icon-status" src={NotifyFailSvg} />,
        closeIcon: <i className="icon-close" />,
    });
};
