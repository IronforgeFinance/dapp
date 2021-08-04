import React, { useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useIntl } from 'umi';
import useAuth from '@/hooks/useAuth';
import { ConnectorNames } from '@/utils/web3';
import IconBinance from '@/assets/images/binance.svg';
import IconMetamask from '@/assets/images/popup_metamask.png';
import IconCopy from '@/assets/images/copy.svg';
import IconLink from '@/assets/images/link.svg';
import IconDown from '@/assets/images/down.svg';
import { Dropdown, Menu } from 'antd';
import Clipboard from 'clipboard';
import './index.less';

export default () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const { login, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleConnect = () => {
        const connectorId = ConnectorNames.Injected;
        login(connectorId);
    };

    const handleLogout = () => {
        logout();
    };

    const handleCopyAddress = () => {
        const clipboard = new Clipboard('#copy-address');
    };

    const addressDisplay = useMemo(() => {
        if (account) {
            return account.substr(0, 5) + '...' + account.substr(-5);
        }
    }, [account]);

    const handleLink = () => {
        const link = process.env.BSC_SCAN_URL + account;
        window.open(link, '_blank');
    };

    const dropdownItem = (
        <div className="dropdown">
            <p className="item header">
                <img src={IconMetamask} alt="" />
                <button className="btn-change btn-common">Change</button>
            </p>
            <p className="item">{addressDisplay}</p>
            <p className="item options">
                <img
                    src={IconCopy}
                    alt=""
                    id="copy-address"
                    data-clipboard-text={account}
                    onClick={handleCopyAddress}
                />

                <img src={IconLink} alt="" onClick={handleLink} />
            </p>
            <p>
                <button
                    className="btn-disconnect common-btn-red"
                    onClick={handleLogout}
                >
                    DISCONNECT
                </button>
            </p>
        </div>
    );

    return (
        <div className="wallet-status-container">
            {!account && (
                <button
                    onClick={handleConnect}
                    className="btn-common btn-connect"
                >
                    {intl.formatMessage({ id: 'nav.connectWallet' })}
                </button>
            )}
            {account && (
                <Dropdown
                    overlay={dropdownItem}
                    trigger={['click']}
                    overlayClassName="custom-dropdown"
                    placement={'bottomLeft'}
                    visible={showDropdown}
                    onVisibleChange={(v) => setShowDropdown(v)}
                >
                    <div className="wallet-connected">
                        <img src={IconBinance} alt="" />
                        <span> {addressDisplay}</span>
                        <img src={IconDown} alt="" />
                    </div>
                </Dropdown>
            )}
        </div>
    );
};
