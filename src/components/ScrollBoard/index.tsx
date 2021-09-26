import './pc.less';
import './mobile.less';

import React, { useCallback } from 'react';
import Overlay from '@/components/Overlay';

interface ISelectTokensProps {
    children?: Object;
    visable: Boolean;
    title?: String;
    onClose?: Function;
    onCustTitle?: Function;
    className?: string;
}

export default (props: ISelectTokensProps) => {
    const {
        children,
        visable,
        onClose: _closeHandler,
        onCustTitle: _custTitle = () => {},
        title,
        className = '',
    } = props;
    const onCloseMemo = useCallback(() => _closeHandler(), []);
    return (
        <Overlay visable={visable} onClose={onCloseMemo}>
            <div className={`board-box ${className}`}>
                {_custTitle() || (
                    <div className="title-wrapper">
                        <h1 className="common-title silver title">
                            <span>{title}</span>
                        </h1>
                    </div>
                )}
                <button className="btn-close" onClick={onCloseMemo}></button>
                <div className="content">{children}</div>
            </div>
        </Overlay>
    );
};
