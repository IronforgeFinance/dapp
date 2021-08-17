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

    /**
     * 该代码用于处理包含块的问题
     * 参考资料：https://juejin.cn/post/6844904046663303181
     *
     * 主要是common-box的after和before两个伪元素用完了，
     * 才想到这个方法来解决该问题
     */
    React.useEffect(() => {
        const wrapperBox: HTMLElement = document.querySelector('.common-box');
        if (wrapperBox?.style) {
            if (visable) {
                wrapperBox.style.filter = 'none';
            } else {
                // * fade out效果占用了一些时间，这里延迟处理
                setTimeout(
                    () =>
                        (wrapperBox.style.filter =
                            'drop-shadow(12px 12px 70px #E78231)'),
                    200,
                );
            }
        }
    }, [visable]);

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
