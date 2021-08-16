import React from 'react';
import './index.less';
import Board from '@/components/Board';
import { CurrencySymbol } from '@/config/constants/types';

interface TokenMap {
    token: string;
    amount: string | number;
    mappingPrice?: string | number;
    symbol?: CurrencySymbol;
}

interface TransitionData {
    label: string;
    value: number | string | TokenMap;
}

interface TransitionConfirmProps {
    visable: Boolean;
    onClose?: Function;
    dataSource: TransitionData[];
}

const DEFAULT_CURRENCY_SYMBOL: CurrencySymbol = '$';

function TransitionConfirm(props: TransitionConfirmProps) {
    const { visable, onClose: _onClose, dataSource } = props;

    return (
        <Board visable={visable} onClose={_onClose} title="Confirm Transaction">
            <ul className="confirm-infos">
                {dataSource.map((prop) => {
                    return (
                        <li key={prop.label} className="info">
                            <span className="label">{prop.label}</span>
                            <div className="value">
                                {typeof prop.value === 'string' && (
                                    <span className="token">{prop.value}</span>
                                )}
                                {typeof prop.value === 'object' && (
                                    <React.Fragment>
                                        <span className="token">
                                            {prop.value.amount}{' '}
                                            {prop.value.token}
                                        </span>
                                        <span className="dollar">
                                            {prop.value.symbol ||
                                                DEFAULT_CURRENCY_SYMBOL}
                                            {prop.value.mappingPrice}
                                        </span>
                                    </React.Fragment>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Board>
    );
}

export default TransitionConfirm;
