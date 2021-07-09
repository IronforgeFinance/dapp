import { useCallback } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { NoBscProviderError } from '@binance-chain/bsc-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector';

import { ConnectorNames, connectorsByName } from '@/utils/web3';
import { setupNetwork } from '@/utils/wallet';

export const connectorLocalStorageKey = 'connectorId';

// api for login and logout
const useAuth = () => {
  const { activate, deactivate } = useWeb3React();
  const login = useCallback(
    (connectorId: ConnectorNames) => {
      const connector = connectorsByName[connectorId];
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetUp = await setupNetwork();
            if (hasSetUp) {
              activate(connector);
            }
          } else {
            window.localStorage.removeItem(connectorLocalStorageKey);
            if (
              error instanceof NoEthereumProviderError ||
              error instanceof NoBscProviderError
            ) {
              alert('Provider error, no provider was found');
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector;
                walletConnector.walletConnectProvider = null;
              }
              alert(
                'Authorization Error, Please authorize to access your account',
              );
            } else {
              alert(error.name + ' ' + error.message);
            }
          }
        });
        window.localStorage.setItem(connectorLocalStorageKey, connectorId);
      } else {
        alert('Unable to find connector');
      }
    },
    [activate],
  );
  const logout = useCallback(() => {
    deactivate();
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName[ConnectorNames.WalletConnect].close();
      connectorsByName[ConnectorNames.WalletConnect].walletConnectProvider =
        null;
    }
  }, [deactivate]);

  return { login, logout };
};

export default useAuth;
