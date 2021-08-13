import React from 'react';
import './index.less';
import classNames from 'classnames';
import { useState } from 'react';
import { useCallback } from 'react';

// TODO left | right 定位
export type PlacementType = 'top' | 'bottom' | 'left' | 'right';

export type TriggerType = 'hover' | 'click';

interface IPopoverProps {
    placement?: PlacementType;
    content: string;
    trigger?: TriggerType;
    children?: React.ReactNode;
}

const Popover = (props: IPopoverProps) => {
    const { placement, content, children, trigger } = props;

    // TODO 封装trigger模式
    const [visable, setVisable] = useState(false);
    let triggerCall: React.MouseEventHandler<HTMLButtonElement>;
    let hideCall: React.FocusEventHandler<HTMLButtonElement> &
        React.MouseEventHandler<HTMLButtonElement>;
    let showCall: React.MouseEventHandler<HTMLButtonElement> &
        React.FocusEventHandler<HTMLButtonElement>;
    switch (trigger) {
        case 'click': {
            triggerCall = useCallback(() => setVisable(!visable), [visable]);
            hideCall = useCallback(() => setVisable(false), []);
            showCall = useCallback(() => setVisable(true), []);
            break;
        }
        default:
    }

    return (
        <div className="popover-wrapper">
            <div
                className={classNames({
                    'visable-wrapper': true,
                    show: visable,
                    hide: !visable,
                })}
            >
                <div
                    className={classNames({
                        popover: true,
                        [placement]: true,
                    })}
                >
                    <p>{content}</p>
                </div>
            </div>
            <button
                className="display"
                onMouseDown={triggerCall}
                onBlur={hideCall}
                onMouseOver={showCall}
                onMouseLeave={hideCall}
            >
                {children}
            </button>
        </div>
    );
};

Popover.defaultProps = {
    placement: 'top' as PlacementType,
    trigger: 'click' as TriggerType,
    content: '',
};

export default Popover;
