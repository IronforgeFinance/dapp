import './less/index.less';

import {
    useCallback,
    useEffect,
    useState,
    useRef,
    createContext,
    ReactNode,
} from 'react';
import ScrollBoard from '@/components/ScrollBoard';
import classNames from 'classnames';
import { getRemainDaysOfQuarterAsset, isDeliveryAsset } from '@/utils';
import { TokenIcon } from '@/components/Icon';
import { useIntl } from 'umi';
import { getTokenPrice } from '@/utils/index';

interface TokenOption {
    name?: string;
    ratio?: Number;
}

interface OpenOptions {
    placeholder?: string;
    callback?(token: string): void;
}

interface TokenSelectorContextProps {
    visible: boolean;
    choosedToken: string;
    open(tokenList: TokenOption[], options?: OpenOptions): void;
    close(): void;
}

export const TokenSelectorContext =
    createContext<TokenSelectorContextProps | null>(null);

interface TokenSelectorProps {
    children: ReactNode;
}

export default (props: TokenSelectorProps) => {
    const intl = useIntl();
    const { children } = props;
    const [visible, setVisible] = useState(false);
    const [choosedToken, setChoosedToken] = useState('');
    const [tokenList, setTokenList] = useState([]);
    const [openOption, setOpenOption] = useState<OpenOptions | null>(null);

    const close = useCallback(() => setVisible(false), []);
    const open = useCallback((tokenList, options) => {
        setTokenList(tokenList);
        setOpenOption(options);
        setVisible(true);
    }, []);
    const makeChoice = useCallback(
        (token) => {
            setChoosedToken(token);
            openOption?.callback(token);
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
        <TokenSelectorContext.Provider
            value={{
                open,
                close,
                choosedToken,
                visible,
            }}
        >
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
                                active: choosedToken === token.name,
                            })}
                            onClick={makeChoice.bind(this, token.name)}
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
            {children}
        </TokenSelectorContext.Provider>
    );
};
