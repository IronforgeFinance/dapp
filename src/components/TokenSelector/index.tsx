import './pc.less';
import './mobile.less';

import { useCallback, useEffect, useState, useContext } from 'react';
import ScrollBoard from '@/components/ScrollBoard';
import classNames from 'classnames';
import { getRemainDaysOfQuarterAsset, isDeliveryAsset } from '@/utils';
import { TokenIcon } from '@/components/Icon';
import { useIntl } from 'umi';
import { getTokenPrice } from '@/utils/index';
import { TokenSelectorContext } from './provider';

export const useTokenSelector = () => {
    return useContext(TokenSelectorContext);
};

export default () => {
    const intl = useIntl();
    const [choosedToken, setChoosedToken] = useState('');
    const { setTokenList, openOption, tokenList, visible, close } =
        useContext(TokenSelectorContext);

    const makeChoice = useCallback(
        (token, remainDays) => {
            if (isDeliveryAsset(token) && remainDays === undefined) {
                return;
            }
            setChoosedToken(token);
            openOption?.callback(token, remainDays);
            close();
        },
        [tokenList, openOption],
    );

    useEffect(() => {
        (async () => {
            if (visible) {
                const tokenPrices = await Promise.all(
                    tokenList.map((token) => getTokenPrice(token.name)),
                );
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
                setTokenList(tokens);
            }
        })();
    }, [visible]);

    return (
        <ScrollBoard
            visable={visible}
            onClose={close}
            title={intl.formatMessage({ id: 'selecttoken' })}
        >
            <ul className="tokenlist">
                <input
                    className="search"
                    type="text"
                    placeholder={
                        openOption?.placeholder ||
                        'Search name or paste address'
                    }
                />
                {tokenList.map((token) => (
                    <li
                        key={token.name}
                        className={classNames({
                            token: true,
                            // active: choosedToken === token.name,
                        })}
                        onClick={makeChoice.bind(
                            this,
                            token.name,
                            token.remainDays,
                        )}
                    >
                        <TokenIcon
                            name={token?.name?.toLowerCase()}
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
                        <span className="price">
                            {token.price ? (
                                `$${token.price}`
                            ) : (
                                <i className="loading" />
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </ScrollBoard>
    );
};
