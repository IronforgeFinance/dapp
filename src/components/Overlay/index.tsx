import './pc.less';
import './mobile.less';

import { useLayoutEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

interface IOverlayProps {
    visable: Boolean;
    onClose?: Function;
    children?: Object;
}

const Overlay = (props: IOverlayProps) => {
    const { visable, onClose, children } = props;

    useLayoutEffect(() => {
        const body = document.querySelector('body');
        visable
            ? (body.style.position = 'fixed')
            : body.removeAttribute('style');
    }, [visable]);

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
