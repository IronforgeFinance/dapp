import './pc.less';
import './mobile.less';

import { useCallback, useState, createContext, ReactNode } from 'react';

export interface TokenOption {
    name?: string;
    ratio?: Number;
}

interface OpenOptions {
    placeholder?: string;
    callback?(token: string, remainDays?: number): void;
}

interface TokenSelectorContextProps {
    visible: boolean;
    open(tokenList: TokenOption[], options?: OpenOptions): void;
    close(): void;
    tokenList: TokenOption[];
    openOption: OpenOptions;
    setTokenList(tokenList: TokenOption[]): void;
}

export const TokenSelectorContext =
    createContext<TokenSelectorContextProps | null>(null);

interface TokenSelectorProviderProps {
    children?: ReactNode;
}

const TokenSelectorProvider = (props: TokenSelectorProviderProps) => {
    const { children } = props;
    const [visible, setVisible] = useState(false);
    const [tokenList, setTokenList] = useState([]);
    const [openOption, setOpenOption] = useState<OpenOptions | null>(null);

    const close = useCallback(() => {
        setVisible(false);
    }, []);
    const open = useCallback((tokenList, options) => {
        setTokenList(tokenList);
        setOpenOption(options);
        setVisible(true);
    }, []);

    return (
        <TokenSelectorContext.Provider
            value={{
                open,
                close,
                visible,
                tokenList,
                openOption,
                setTokenList,
            }}
        >
            {children}
        </TokenSelectorContext.Provider>
    );
};

export default TokenSelectorProvider;
