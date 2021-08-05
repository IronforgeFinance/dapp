import React from 'react';
import './index.less';
import { CSSTransition } from 'react-transition-group';
import { useCallback } from 'react';

interface IOverlayProps {
    visable: Boolean;
    onClose?: Function;
    children?: Object;
}

export default (props: IOverlayProps) => {
    const { visable, onClose, children } = props;

    const onCloseMemo = useCallback(() => onClose(), []);

    return (
        <CSSTransition
            in={visable}
            timeout={300}
            unmountOnExit
            classNames="overlay"
            onExited={onCloseMemo}
        >
            {/* TODO postion改成自定义 */}
            <div className="overlay center">{children}</div>
        </CSSTransition>
    );
};
