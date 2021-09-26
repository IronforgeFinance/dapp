import './pc.less';
import './mobile.less';

import classNames from 'classnames';
import { useState, useEffect, useContext } from 'react';
import { setLocale } from 'umi';
import {
    LangContext,
    LangMap,
    LANG_CACHE_KEY,
    LocaleMap,
    LangType,
    LocaleType,
} from './provider';

export const useLang = () => {
    return useContext(LangContext);
};

export default () => {
    const [show, setShow] = useState(false);
    const { lang, setLang } = useContext(LangContext);

    useEffect(() => {
        setShow(false);
        setLocale(LocaleMap[lang as LocaleType], false);
        localStorage.setItem(LANG_CACHE_KEY, lang);
    }, [lang]);

    return (
        <div className="lang-switcher">
            <button
                className="display"
                onClick={() => setShow(!show)}
                onBlur={() => setShow(false)}
            >
                <i
                    className={classNames({
                        icon: true,
                        [`icon-lang ${lang.toLowerCase()}`]: true,
                    })}
                />
                <span className="name">{lang}</span>
            </button>
            <div
                className={classNames({
                    'lang-wrapper': true,
                    show: show,
                    hide: !show,
                })}
            >
                <ul className="lang-list">
                    {Object.entries(LangMap).map(([key, value]) => (
                        <li
                            key={key}
                            className={classNames({
                                'lang-item': true,
                                active: lang === key,
                            })}
                            onMouseDown={() => setLang(key)}
                        >
                            {value}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
