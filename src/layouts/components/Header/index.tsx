import './less/index.less';

import React from 'react';
import { NavLink, useIntl } from 'umi';
import WalletStatus from '../WalletStatus';
import Logo from '@/assets/images/header-logo.png';
import useEagerConnect from '@/hooks/useEagerConnect';
import LangSwitcher from '../LangSwitcher';
import useEnv from '@/hooks/useEnv';

export default () => {
    const isMobile = useEnv();
    const intl = useIntl();
    useEagerConnect();

    return (
        <div className="header-nav">
            <img className="logo" src={Logo} />
            {!isMobile && (
                <ul>
                    <li>
                        <NavLink exact to="/">
                            {intl.formatMessage({ id: 'nav.home' })}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/mint">
                            {intl.formatMessage({ id: 'nav.mint' })}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/burn">
                            {intl.formatMessage({ id: 'nav.burn' })}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/trade">
                            {intl.formatMessage({ id: 'nav.trade' })}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/farm">
                            {intl.formatMessage({ id: 'nav.farm' })}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/wallet">
                            {intl.formatMessage({ id: 'nav.wallet' })}
                        </NavLink>
                    </li>
                </ul>
            )}
            {isMobile && <div className="fill" />}
            <div className="wallet-status">
                <WalletStatus />
            </div>
            <div className="lang-box">
                <LangSwitcher />
            </div>
        </div>
    );
};
