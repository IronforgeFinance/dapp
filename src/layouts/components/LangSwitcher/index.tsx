import React from 'react';
import './index.less';
import classNames from 'classnames';
import { useState } from 'react';
import { useEffect } from 'react';
import { setLocale } from 'umi';

export type LangType = 'EN' | 'CN';
export type LocaleType = 'en-US' | 'zh-CN';

export const LangMap = {
    EN: 'English',
    ZH: 'Chinese',
};

export const LocaleMap = {
    EN: 'en-US',
    ZH: 'zh-CN',
};

export default () => {
    const [lang, setLang] = useState('EN');
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(false);
        setLocale(LocaleMap[lang as LocaleType], false);
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
