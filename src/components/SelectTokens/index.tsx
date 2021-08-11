import React, { useCallback } from 'react';
import Board from '@/components/Board';
import classNames from 'classnames';
import './index.less';
import { getRemainDaysOfQuarterAsset, isDeliveryAsset } from '@/utils';
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
        tokenList = [],
        onClose: _closeHandler,
        onSelect: _selectHandler,
    } = props;

    const _close = useCallback(() => _closeHandler(), []);
    const _select = useCallback((token) => {
        _selectHandler(token);
        _close();
    }, []);
    // const tokenList = new Array(100).fill('').map((item, index) => index + 1);

    return (
        <div className="select-tokens">
            <Board visable={visable} onClose={_close} title="Select a Token">
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
                            onClick={_select.bind(this, token.name)}
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
                                {isDeliveryAsset(token.name) && (
                                    <span className="remain-days">
                                        {getRemainDaysOfQuarterAsset(
                                            token.name.split('-')[1],
                                        )}
                                        days
                                    </span>
                                )}
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
