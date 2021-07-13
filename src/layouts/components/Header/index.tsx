import React from 'react';
import { NavLink, useIntl } from 'umi';
import './index.less';
import WalletStatus from '../WalletStatus';
import Logo from '@/assets/images/home_logo.png';

export default () => {
  const intl = useIntl();

  return (
    <div className="header-nav">
      <img className="logo" src={Logo} alt="" />
      <ul>
        <li>
          <NavLink exact to="/">
            {intl.formatMessage({ id: 'nav.home' })}
          </NavLink>
        </li>
        <li>
          <NavLink to="/mint">{intl.formatMessage({ id: 'nav.mint' })}</NavLink>
        </li>
        <li>
          <NavLink to="/burn">{intl.formatMessage({ id: 'nav.burn' })}</NavLink>
        </li>
        <li>
          <NavLink to="/trade">
            {intl.formatMessage({ id: 'nav.trade' })}
          </NavLink>
        </li>
        <li>
          <NavLink to="/farm">{intl.formatMessage({ id: 'nav.farm' })}</NavLink>
        </li>
        <li>
          <NavLink to="/wallet">
            {intl.formatMessage({ id: 'nav.wallet' })}
          </NavLink>
        </li>
      </ul>
      <div className="wallet-status">
        <WalletStatus />
      </div>
    </div>
  );
};
