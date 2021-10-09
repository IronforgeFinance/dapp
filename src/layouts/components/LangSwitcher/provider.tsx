import { createContext, useState, ReactNode } from 'react';

interface LangContextProps {
    lang: string;
    setLang(lang: string): void;
}

interface LangContextProviderProps {
    children?: ReactNode;
}

export const LangContext = createContext<LangContextProps | null>(null);

export const LangMap = {
    EN: 'English',
    ZH: '中文',
};

export const LocaleMap = {
    EN: 'en-US',
    ZH: 'zh-CN',
};

export type LangType = 'EN' | 'CN';
export type LocaleType = 'en-US' | 'zh-CN';

export const LANG_CACHE_KEY = 'lang';

const LangContextProvider = (props: LangContextProviderProps) => {
    const { children } = props;
    const [lang, setLang] = useState(
        localStorage.getItem(LANG_CACHE_KEY) ?? ('EN' as keyof typeof LangMap),
    );

    return (
        <LangContext.Provider
            value={{
                lang,
                setLang,
            }}
        >
            {children}
        </LangContext.Provider>
    );
};

export default LangContextProvider;
