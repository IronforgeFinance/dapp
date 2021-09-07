import './less/index.less';

import React from 'react';
import Board from '@/components/Board';
import config, {
    connectorLocalStorageKey,
    walletLocalStorageKey,
} from './config';
import { ConnectorNames, Config } from './types';
import classNames from 'classnames';
import useAuth from '@/hooks/useAuth';
import { useIntl } from 'umi';

type ConnectStatus = 'connected' | 'unconnect';

interface WalletModalProps {
    childiren?: React.ReactNode;
    visable: boolean;
    closeOnIconClick?: Function;
    displayCount: number;
    status: ConnectStatus;
}

const invokedChain = Promise.resolve();

const getPreferredConfig = (walletConfig: Config[]) => {
    const preferredWalletName = localStorage.getItem(walletLocalStorageKey);
    const sortedConfig = walletConfig.sort(
        (a: Config, b: Config) => a.priority - b.priority,
    );

    if (!preferredWalletName) {
        return sortedConfig;
    }

    const preferredWallet = sortedConfig.find(
        (sortedWalletConfig) =>
            sortedWalletConfig.title === preferredWalletName,
    );

    if (!preferredWallet) {
        return sortedConfig;
    }

    return [
        preferredWallet,
        ...sortedConfig.filter(
            (sortedWalletConfig) =>
                sortedWalletConfig.title !== preferredWalletName,
        ),
    ];
};

const WalletModal = (props: WalletModalProps) => {
    const intl = useIntl();
    const { visable, closeOnIconClick, status, displayCount } = props;
    const { login, logout } = useAuth();

    // show more, derive from pancake-uikit, we don't have this requirement, ignore...
    const [showMore, setShowMore] = React.useState(false);
    const [isConnected, setIsConnected] = React.useState(false);
    const [isChanging, setIsChanging] = React.useState(false);
    const sortedConfig = getPreferredConfig(config);
    const displayListConfig = showMore
        ? sortedConfig
        : sortedConfig.slice(0, displayCount);

    const currentWallet = React.useMemo(
        () => (isConnected ? localStorage.getItem(walletLocalStorageKey) : ''),
        [isConnected, isChanging],
    );

    const title = React.useMemo(
        () =>
            isConnected
                ? intl.formatMessage({ id: 'changeWallet' })
                : intl.formatMessage({ id: 'connectWallet' }),
        [isConnected],
    );

    const changeAccount = React.useCallback(
        (login) =>
            invokedChain
                .then(() => setIsChanging(true))
                .then(logout)
                .then(login)
                .then(() => setIsChanging(false)),
        [],
    );

    React.useLayoutEffect(() => {
        if (visable && !isChanging) {
            setIsConnected(status === 'connected');
        }
    }, [status, visable, isChanging]);

    return (
        <Board
            className="custom-board"
            visable={visable}
            onClose={closeOnIconClick}
            title={title}
        >
            <div className="wallet-modal">
                <ul className="connectors">
                    {displayListConfig.map((walletConfig) => {
                        // WalletCard
                        const { title, icon: WalletIcon } = walletConfig;

                        return (
                            <li
                                key={title}
                                className={classNames({
                                    connector: true,
                                    active:
                                        walletConfig.title === currentWallet,
                                })}
                                onClick={() => {
                                    const connect = () => {
                                        // About MSStream: https://docs.microsoft.com/en-us/previous-versions/hh772328(v=vs.85)
                                        const isIOS =
                                            /iPad|iPhone|iPod/.test(
                                                navigator.userAgent,
                                            ) && !window.MSStream;

                                        // Since iOS does not support Trust Wallet we fall back to WalletConnect
                                        if (
                                            walletConfig.title ===
                                                'Trust Wallet' &&
                                            isIOS
                                        ) {
                                            login(ConnectorNames.WalletConnect);
                                        } else {
                                            login(walletConfig.connectorId);
                                        }

                                        localStorage.setItem(
                                            walletLocalStorageKey,
                                            walletConfig.title,
                                        );
                                        localStorage.setItem(
                                            connectorLocalStorageKey,
                                            walletConfig.connectorId,
                                        );

                                        closeOnIconClick(false);
                                    };

                                    if (
                                        isConnected &&
                                        walletConfig.title !== currentWallet
                                    )
                                        return changeAccount(connect);

                                    connect();
                                }}
                                id={`wallet-connect-${title.toLocaleLowerCase()}`}
                            >
                                <WalletIcon />
                                <span className="title">{title}</span>
                                <i className="connect-success" />
                            </li>
                        );
                    })}
                </ul>
                {!isConnected && (
                    <div className="unconnected">
                        <p className="tip">Haven't got a crypto wallet yet?</p>
                        <button className="learn-connect-btn common-btn common-btn-red">
                            Learn How to Connect
                        </button>
                    </div>
                )}
            </div>
        </Board>
    );
};

WalletModal.defaultProps = {
    status: 'unconnect',
    visable: false,
    displayCount: 6,
};

export default WalletModal;
