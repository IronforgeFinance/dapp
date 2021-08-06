import React, { useCallback } from 'react';
import Board from '@/components/Board';
import classNames from 'classnames';
import './index.less';

interface TokenOption {
    name: string;
    ratio?: Number;
}

interface ISelectTokensProps {
    children?: Object;
    visable: Boolean;
    value?: String;
    onClose?: Function;
    onSelect?: Function;
    tokenList?: TokenOption[];
}

export default (props: ISelectTokensProps) => {
    const {
        children,
        visable,
        value,
        tokenList,
        onClose: _closeHandler,
        onSelect: _selectHandler,
    } = props;

    const onCloseMemo = useCallback(() => _closeHandler(), []);
    const onSelectMemo = useCallback((token) => _selectHandler(token), []);
    // const tokenList = new Array(100).fill('').map((item, index) => index + 1);

    return (
        <div className="setting">
            <Board visable={visable} onClose={onCloseMemo}>
                <ul className="tokenlist">
                    <input
                        className="search"
                        type="text"
                        placeholder="Search name or paste address"
                    />
                    {tokenList.map((token) => (
                        <li
                            key={token.name}
                            className={classNames({
                                token: true,
                                active: value === token.name,
                            })}
                            onClick={onSelectMemo.bind(this, token.name)}
                        >
                            <i
                                className={classNames({
                                    'icon-token': true,
                                    'size-24': true,
                                    [token.name.toLowerCase()]: true,
                                })}
                            />
                            <span className="name">
                                {token.name.toUpperCase()}
                            </span>
                            <span className="price">{token.ratio || ''}</span>
                        </li>
                    ))}
                </ul>
            </Board>
            {children}
        </div>
    );
};
