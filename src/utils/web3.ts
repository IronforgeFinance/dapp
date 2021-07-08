import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { BscConnector } from '@binance-chain/bsc-connector';
import { ethers } from 'ethers';
import getNodeUrl from './getRpcUrl';

const POLLING_INTERVAL = 12000;
const chainId = parseInt(process.env.APP_CHAIN_ID, 10);
console.log('chainId: ', process.env);
const rpcUrl = getNodeUrl();

export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

const injected = new InjectedConnector({ supportedChainIds: [chainId] });

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  bridge: 'https://pancakeswap.bridge.walletconnect.org/',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

const bscConnector = new BscConnector({ supportedChainIds: [chainId] });

export enum ConnectorNames {
  Injected = 'Injected',
  WalletConnect = 'WalletConnect',
  BSC = 'BSC',
}

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
};
