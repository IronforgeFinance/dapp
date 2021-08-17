import React, { useCallback, useEffect, useState, useRef } from 'react';
import Board from '@/components/Board';
import classNames from 'classnames';
import './index.less';
import { getRemainDaysOfQuarterAsset, isDeliveryAsset } from '@/utils';
import { usePrices } from '@/hooks/useContract';
import { ethers } from 'ethers';
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
        onClose,
        onSelect,
    } = props;

    const [tokens, setTokens] = useState([]);
    const isMounted = useRef(false);

    const prices = usePrices();

    const getTokenPrice = async (token: string) => {
        if (!token) return 0;
        const res = await prices.getPrice(
            ethers.utils.formatBytes32String(token),
        );
        return parseFloat(ethers.utils.formatEther(res));
    };

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

    useEffect(() => {
        (async () => {
            const tokenPrices = await Promise.all(
                tokenList.map((token) => getTokenPrice(token.name)),
            );
            if (isMounted.current) {
                const tokens = tokenList.map((item, index) => {
                    const _token: any = {
                        name: item.name,
                        price: tokenPrices[index],
                    };
                    if (isDeliveryAsset(item.name)) {
                        const quarter = item.name.split('-')[1];
                        _token.isDeliveryAsset = /^\d+$/.test(quarter);

                        if (_token.isDeliveryAsset) {
                            _token.remainDays = getRemainDaysOfQuarterAsset(
                                quarter,
                            );
                        }
                    }
                    return _token;
                });
                setTokens(tokens);
            }
        })();
    }, [tokenList]);

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    const _onClose = useCallback(() => onClose(), []);
    const _onSelect = useCallback((token) => {
        onSelect(token);
        _onClose();
    }, []);
    // const tokenList = new Array(100).fill('').map((item, index) => index + 1);

    return (
        <div className="select-tokens">
            <Board visable={visable} onClose={_onClose} title="Select a Token">
                <ul className="tokenlist">
                    <input
                        className="search"
                        type="text"
                        placeholder="Search name or paste address"
                    />
                    {tokens.map((token) => (
                        <li
                            key={token.name}
                            className={classNames({
                                token: true,
                                active: value === token.name,
                            })}
                            onClick={_onSelect.bind(this, token.name)}
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
                                {token.isDeliveryAsset && (
                                    <span className="remain-days">
                                        {token.remainDays}
                                        days
                                    </span>
                                )}
                            </span>
                            <span className="price">{token.price}</span>
                        </li>
                    ))}
                </ul>
            </Board>
            {children}
        </div>
    );
};
