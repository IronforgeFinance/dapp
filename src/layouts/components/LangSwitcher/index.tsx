import './pc.less';
import './mobile.less';

import React from 'react';
import classNames from 'classnames';
import { useState } from 'react';
import { useEffect } from 'react';
import { setLocale } from 'umi';

export type LangType = 'EN' | 'CN';
export type LocaleType = 'en-US' | 'zh-CN';

export const LangMap = {
    EN: 'English',
    ZH: '中文',
};

export const LocaleMap = {
    EN: 'en-US',
    ZH: 'zh-CN',
};

export const LANG_CACHE_KEY = 'lang';

export default () => {
    const [lang, setLang] = useState(
        localStorage.getItem(LANG_CACHE_KEY) ?? ('EN' as keyof typeof LangMap),
    );
    const [show, setShow] = useState(false);

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
