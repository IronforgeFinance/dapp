import './less/index.less';

import React from 'react';
import SelectBoard from '@/components/SelectBoard';
import { FiatSymbol } from '@/config/constants/types';
import { TokenIcon } from '../Icon';
import classNames from 'classnames';

type DirectType = 'from' | 'to';

interface TokenMap {
    token: string;
    amount: string | number;
    mappingPrice?: string | number;
    symbol?: FiatSymbol;
}

interface TransitionData {
    label: string;
    direct?: DirectType;
    value: number | string | TokenMap;
}

interface TransitionConfirmProps {
    visable: Boolean;
    onClose?: Function;
    dataSource?: TransitionData[];
}

const DEFAULT_CURRENCY_SYMBOL: FiatSymbol = '$';

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
        <SelectBoard
            visable={visable}
            onClose={_onClose}
            title="Confirm Transaction"
        >
            <ul className="confirm-infos">
                {(dataSource ?? []).map((prop) => {
                    return (
                        <React.Fragment key={prop.label}>
                            <li
                                className={classNames({
                                    info: true,
                                    'is-form': prop.direct === 'from',
                                    'is-to': prop.direct === 'to',
                                })}
                            >
                                <div className="left">
                                    {typeof prop.value === 'object' && (
                                        <div className="token">
                                            <TokenIcon
                                                style={{ marginRight: 5 }}
                                                name={prop.value.token}
                                            />
                                            <span>{prop.value.token}</span>
                                        </div>
                                    )}
                                    <span className="label">{prop.label}</span>
                                </div>
                                <div className="right">
                                    {typeof prop.value === 'string' && (
                                        <span className="token">
                                            {prop.value}
                                        </span>
                                    )}
                                    {typeof prop.value === 'object' && (
                                        <React.Fragment>
                                            <span className="amount">
                                                {prop.value.amount}
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
                            {prop.direct === 'from' && <i className="arrow" />}
                        </React.Fragment>
                    );
                })}
            </ul>
        </SelectBoard>
    );
}

TransitionConfirm.defaultProps = {
    dataSource: [],
};

export default TransitionConfirm;
