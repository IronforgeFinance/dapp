import './pc.less';
import './mobile.less';

import React, { useMemo, useState, useEffect, Fragment } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useIntl, useModel } from 'umi';
import useAuth from '@/hooks/useAuth';
import { ConnectorNames } from '@/utils/web3';
import IconBinance from '@/assets/images/binance.svg';
import IconMetamask from '@/assets/images/popup_metamask.png';
import IconCopy from '@/assets/images/copy.svg';
import IconLink from '@/assets/images/skip-white.svg';
import IconDown from '@/assets/images/down.svg';
import HoverIconDown from '@/assets/images/down-hover.svg';
import { Dropdown, Menu, Popover } from 'antd';
import Clipboard from 'clipboard';
import WalletModal from '../WalletModal';
import useEnv from '@/hooks/useEnv';

export default () => {
    const intl = useIntl();
    const { isMobile } = useEnv();
    const { account } = useWeb3React();
    const { login, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [visable, setVisable] = useState(false);

    const { connectWalletSignal, setConnectWalletSignal } = useModel(
        'app',
        (model) => ({
            connectWalletSignal: model.connectWalletSignal,
            setConnectWalletSignal: model.setConnectWalletSignal,
        }),
    );

    useEffect(() => {
        if (connectWalletSignal) {
            setVisable(true);
        }
    }, [connectWalletSignal]);

    useEffect(() => {
        if (!visable) {
            setConnectWalletSignal(0);
        }
    }, [visable]);

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
                <img src={IconMetamask} />
                <button
                    className="btn-change btn-common"
                    onClick={() => setVisable(true)}
                >
                    {intl.formatMessage({ id: 'change' })}
                </button>
            </p>
            <p className="item">{addressDisplay}</p>
            <p className="item options">
                <Popover
                    placement="bottom"
                    trigger="hover"
                    content="Copy to clipboard"
                >
                    <img
                        src={IconCopy}
                        alt=""
                        id="copy-address"
                        data-clipboard-text={account}
                        onClick={handleCopyAddress}
                    />
                </Popover>

                <img src={IconLink} alt="" onClick={handleLink} />
            </p>
            <p>
                <button
                    className="btn-disconnect common-btn common-btn-red"
                    onClick={handleLogout}
                >
                    {intl.formatMessage({ id: 'disconnect' })}
                </button>
            </p>
        </div>
    );

    return (
        <div className="wallet-status-container">
            <WalletModal
                visable={visable}
                closeOnIconClick={() => setVisable(false)}
                status={account ? 'connected' : 'unconnect'}
            />

            {!account && (
                <button
                    onClick={() => setVisable(true)}
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
                        {!isMobile && (
                            <Fragment>
                                <img src={IconBinance} />
                                <span> {addressDisplay}</span>
                                <i className="arrow-down" />
                            </Fragment>
                        )}
                        {isMobile && (
                            <button className="mobile-wallet-btn">
                                <img src={IconMetamask} />
                                <i className="arrow-down" />
                            </button>
                        )}
                    </div>
                </Dropdown>
            )}
        </div>
    );
};
