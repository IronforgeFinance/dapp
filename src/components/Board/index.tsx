import React, { useCallback } from 'react';
import Overlay from '@/components/Overlay';
import './index.less';

interface ISelectTokensProps {
    children?: Object;
    visable: Boolean;
    onClose?: Function;
    onCustTitle?: Function;
}

export default (props: ISelectTokensProps) => {
    const {
        children,
        visable,
        onClose: _closeHandler,
        onCustTitle: _custTitle = () => {},
    } = props;
    const onCloseMemo = useCallback(() => _closeHandler(), []);
    return (
        <Overlay visable={visable} onClose={onCloseMemo}>
            <div className="board-box">
                {_custTitle() || <h1 className="titile"></h1>}
                <button className="btn-close" onClick={onCloseMemo}></button>
                <div className="content">{children}</div>
            </div>
        </Overlay>
    );
};
