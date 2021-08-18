import React from 'react';
import './index.less';
import { CSSTransition } from 'react-transition-group';
import { useCallback } from 'react';

interface IOverlayProps {
    visable: Boolean;
    onClose?: Function;
    children?: Object;
}

const Overlay = (props: IOverlayProps) => {
    const { visable, onClose, children } = props;

    return (
        <CSSTransition
            in={visable}
            timeout={300}
            unmountOnExit
            classNames="weighing overlay"
            onExited={() => onClose()}
        >
            {/* TODO postion改成自定义 */}
            <div className="overlay center">{children}</div>
        </CSSTransition>
    );
};

Overlay.defaultProps = {
    visable: false,
    onClose: () => {},
};

export default Overlay;
