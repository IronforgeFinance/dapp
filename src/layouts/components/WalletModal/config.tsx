import { WalletIcon } from '@/components/Icon';

const Metamask = () => <WalletIcon name="metamask" size={28} />;
const WalletConnect = () => <WalletIcon name="wallet-connect" size={28} />;
const TrustWallet = () => <WalletIcon name="trust-wallet" size={28} />;
const MathWallet = () => <WalletIcon name="math-wallet" size={28} />;
const TokenPocket = () => <WalletIcon name="token-pocket" size={28} />;
const BinanceChain = () => <WalletIcon name="binance-chain" size={28} />;
const SafePal = () => <WalletIcon name="safe-pal" size={28} />;
const Coin98 = () => <WalletIcon name="coin98" size={28} />;

import { Config, ConnectorNames } from './types';

const connectors: Config[] = [
    {
        title: 'Metamask',
        icon: Metamask,
        connectorId: ConnectorNames.Injected,
        priority: 1,
    },
    {
        title: 'WalletConnect',
        icon: WalletConnect,
        connectorId: ConnectorNames.WalletConnect,
        priority: 2,
    },
    {
        title: 'Trust Wallet',
        icon: TrustWallet,
        connectorId: ConnectorNames.Injected,
        priority: 3,
    },
    {
        title: 'MathWallet',
        icon: MathWallet,
        connectorId: ConnectorNames.Injected,
        priority: 999,
    },
    {
        title: 'TokenPocket',
        icon: TokenPocket,
        connectorId: ConnectorNames.Injected,
        priority: 999,
    },

    {
        title: 'Binance Chain',
        icon: BinanceChain,
        connectorId: ConnectorNames.BSC,
        priority: 999,
    },
    {
        title: 'SafePal',
        icon: SafePal,
        connectorId: ConnectorNames.Injected,
        priority: 999,
    },
    {
        title: 'Coin98',
        icon: Coin98,
        connectorId: ConnectorNames.Injected,
        priority: 999,
    },
];

export default connectors;
export const connectorLocalStorageKey = 'connectorIdv2';
export const walletLocalStorageKey = 'wallet';
