import { useEffect } from 'react';
import useAuth from './useAuth';
import { connectorLocalStorageKey } from '@/layouts/components/WalletModal/config';
import { ConnectorNames, connectorsByName } from '@/utils/web3';

const _binanceChainListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'BinanceChain', {
      get() {
        return this.bsc;
      },
      set(bsc) {
        this.bsc = bsc;

        resolve();
      },
    }),
  );

// connect wallet eagerly
const useEagerConnect = () => {
  const { login } = useAuth();

  useEffect(() => {
    const connectorId = window.localStorage.getItem(
      connectorLocalStorageKey,
    ) as ConnectorNames;

    if (connectorId) {
      const isConnectorBinanceChain = connectorId === ConnectorNames.BSC;
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain');

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        _binanceChainListener().then(() => login(connectorId));

        return;
      }

      login(connectorId);
    }
  }, [login]);
};

export default useEagerConnect;
