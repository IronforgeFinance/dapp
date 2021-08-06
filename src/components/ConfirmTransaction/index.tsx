import React, { useCallback } from 'react';
import Board from '@/components/Board';
import './index.less';

interface DataOption {
    prop: string;
    value: Number;
    token: String;
    extra?: String | Number;
}

interface IConfirmTransactionProps {
    children?: Object;
    visable: Boolean;
    onClose?: Function;
    dataSource: DataOption[];
}

export default (props: IConfirmTransactionProps) => {
    const {
        children,
        visable,
        dataSource = [],
        onClose: _closeHandler,
    } = props;
    const onCloseMemo = useCallback(() => _closeHandler(), []);
    const WhiteSpace = () => (
        <div
            dangerouslySetInnerHTML={{
                __html: '&nbsp;',
            }}
        />
    );
    const custTitle = () => {
        return <h1 className="confirm-titile"></h1>;
    };

    return (
        <div className="confirm-transaction">
            <Board
                visable={visable}
                onClose={onCloseMemo}
                onCustTitle={custTitle}
            >
                <ul className="list">
                    {dataSource.map((item) => {
                        return (
                            <li key={item.prop} className="item">
                                <div className="head">
                                    <span className="prop">{item.prop}</span>
                                    <span className="value">
                                        {item.value}
                                        <WhiteSpace />
                                        {item.token}
                                    </span>
                                </div>
                                {item.extra && (
                                    <div className="foot">
                                        <p className="extra">{item.extra}</p>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </Board>
            {children}
        </div>
    );
};
