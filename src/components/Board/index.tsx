import React, { useCallback } from 'react';
import Overlay from '@/components/Overlay';
import './index.less';

interface ISelectTokensProps {
    children?: Object;
    visable: Boolean;
    title?: String;
    onClose?: Function;
    onCustTitle?: Function;
}

export default (props: ISelectTokensProps) => {
    const {
        children,
        visable,
        onClose: _closeHandler,
        onCustTitle: _custTitle = () => {},
        title,
    } = props;
    const onCloseMemo = useCallback(() => _closeHandler(), []);
    return (
        <Overlay visable={visable} onClose={onCloseMemo}>
            <div className="board-box">
                {_custTitle() || (
                    <div className="title-wrapper">
                        <h1 className="titile">
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
