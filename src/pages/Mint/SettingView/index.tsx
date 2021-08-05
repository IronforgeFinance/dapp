import React, { useState } from 'react';
import Overlay from '@/components/Overlay';
import classNames from 'classnames';
import { useCallback } from 'react';
import './index.less';

export default () => {
    const [showSetting, setShowSetting] = useState(false);

    const onCloseMemo = useCallback(() => setShowSetting(false), []);
    const tokenList = new Array(100).fill('').map((item, index) => index + 1);

    return (
        <div className="setting">
            <Overlay visable={showSetting} onClose={onCloseMemo}>
                <div className="select-token-box">
                    <h1 className="titile"></h1>
                    <button
                        className="btn-close"
                        onClick={onCloseMemo}
                    ></button>
                    <ul className="tokenlist">
                        <input
                            className="search"
                            type="text"
                            placeholder="Search name or paste address"
                        />
                        {tokenList.map((item) => (
                            <li
                                key={item}
                                className={classNames({
                                    token: true,
                                    active: item == 1,
                                })}
                            >
                                <i
                                    className={classNames({
                                        'icon-token': true,
                                        'icon-size-24': true,
                                        [String('usdt').toLowerCase()]: true,
                                    })}
                                />
                                <span className="name">BTC</span>
                                <span className="price">0.222</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Overlay>
            <button
                className="btn-setting"
                onClick={() => setShowSetting(true)}
            />
        </div>
    );
};
