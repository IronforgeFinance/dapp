import React, { useCallback } from 'react';
import Board from '@/components/Board';
import classNames from 'classnames';
import './index.less';

interface ISelectTokensProps {
    children?: Object;
    visable: Boolean;
    onClose?: Function;
}

export default (props: ISelectTokensProps) => {
    const { children, visable, onClose: _closeHandler } = props;

    const onCloseMemo = useCallback(() => _closeHandler(), []);
    const tokenList = new Array(100).fill('').map((item, index) => index + 1);

    return (
        <div className="setting">
            <Board visable={visable} onClose={onCloseMemo}>
                <ul className="tokenlist">
                    <input
                        className="search"
                        type="text"
                        placeholder="Search name or paste address"
                    />
                    {tokenList.map((item) => (
                        <li
                            key={item}
                            className={classNames({
                                token: true,
                                active: item == 1,
                            })}
                        >
                            <i
                                className={classNames({
                                    'icon-token': true,
                                    'icon-size-24': true,
                                    [String('usdt').toLowerCase()]: true,
                                })}
                            />
                            <span className="name">BTC</span>
                            <span className="price">0.222</span>
                        </li>
                    ))}
                </ul>
            </Board>
            {children}
        </div>
    );
};
