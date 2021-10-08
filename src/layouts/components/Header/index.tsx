import './pc.less';
import './mobile.less';

import { useLayoutEffect, useRef } from 'react';
import { NavLink, useIntl, history } from 'umi';
import WalletStatus from '../WalletStatus';
import MobileNavigation from './components/MobileNavigation';
import Logo from '@/assets/images/header-logo.png';
import useEagerConnect from '@/hooks/useEagerConnect';
import LangSwitcher from '../LangSwitcher';
import useEnv from '@/hooks/useEnv';
import { throttle } from 'lodash';

const MAX_SCROLL = 0.5;

export default () => {
    const { isMobile } = useEnv();
    const intl = useIntl();
    const header = useRef(null);
    useEagerConnect();

    useLayoutEffect(() => {
        const callback = throttle(() => {
            if (!header.current) {
                header.current = document.querySelector(
                    '.header-nav',
                ) as HTMLElement;
            }

            console.log('>> scrollTop ', window.scrollY);
            header.current.style.background = `rgba(71, 57, 44, ${Math.min(
                MAX_SCROLL,
                window.scrollY / 100,
            )})`;
        }, 100);

        document.addEventListener('wheel', callback);

        return () => {
            document.removeEventListener('wheel', callback);
        };
    }, []);

    return (
        <div className="header-nav">
            <div className="left-box">
                <img
                    className="logo"
                    src={Logo}
                    onClick={() => history.push('/')}
                />
            </div>
            {!isMobile && (
                <div className="mid-box">
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
                </div>
            )}
            <div className="right-box">
                <WalletStatus />
                <LangSwitcher />
                {isMobile && <MobileNavigation />}
            </div>
        </div>
    );
};
