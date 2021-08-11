import React from 'react';
import './index.less';
import { notification } from 'antd';
import LinkSvg from '@/assets/images/link.svg';
import NotifySuccessSvg from '@/assets/images/notify-success.svg';
import NotifyFailSvg from '@/assets/images/notify-fail.svg';

interface Notification {
    message: string;
    description: string;
}

interface SuccessProps extends Notification {
    showView?: boolean;
    view?: React.ReactNode;
    viewLink?: string;
}

interface FailProps extends Notification {}

export const success = (props: SuccessProps) => {
    const { message, description, view: ViewNode, showView, viewLink } = props;

    notification.success({
        duration: 0,
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
    const { message, description } = props;

    notification.error({
        duration: 0,
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
