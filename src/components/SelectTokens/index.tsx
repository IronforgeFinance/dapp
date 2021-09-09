import './less/index.less';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import SelectBoard from '@/components/SelectBoard';
import classNames from 'classnames';
import { getRemainDaysOfQuarterAsset, isDeliveryAsset } from '@/utils';
import { TokenIcon } from '@/components/Icon';
import { useIntl } from 'umi';
import { getTokenPrice } from '@/utils/index';
interface TokenOption {
    name?: string;
    ratio?: Number;
}

interface ISelectTokensProps {
    children?: Object;
    // visible: Boolean;
    value?: String;
    onClose?: Function;
    onSelect?: Function;
    tokenList?: TokenOption[];
    placeholder?: string;
}

export default (props: ISelectTokensProps) => {
    const intl = useIntl();
    const {
        children,
        value,
        tokenList = [],
        onClose,
        onSelect,
        placeholder,
    } = props;
    const [visible, setVisible] = useState(false);
    const [tokens, setTokens] = useState([]);
    const isMounted = useRef(false);

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
            if (visible) {
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
    }, [visible]);

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
                        const reg = /^.+(\d{6})$/;
                        const quarter = item.name.match(reg)[1];
                        _token.isDeliveryAsset = true;

                        if (_token.isDeliveryAsset) {
                            _token.remainDays =
                                getRemainDaysOfQuarterAsset(quarter);
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

    const _onClose = () => {
        onClose?.();
        setVisible(false);
    };
    // const _onSelect = useCallback((token) => {
    //     onSelect(token);
    //     _onClose();
    // }, []);
    const _onSelect = (token) => {
        if (token === value) {
            return;
        }
        onSelect(token);
        _onClose();
    };

    return (
        <div className="select-tokens">
            <SelectBoard
                visable={visible}
                onClose={_onClose}
                title={intl.formatMessage({ id: 'selecttoken' })}
            >
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
                            <TokenIcon
                                name={token.name.toLowerCase()}
                                size={24}
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
                            <span className="price">${token.price}</span>
                        </li>
                    ))}
                </ul>
            </SelectBoard>
            <button className="btn-mint-form" onClick={() => setVisible(true)}>
                <span>
                    {value || (
                        <span>
                            {placeholder ||
                                intl.formatMessage({ id: 'selecttoken' })}
                        </span>
                    )}
                </span>
                <i className="icon-down size-24" />
            </button>
        </div>
    );
};
