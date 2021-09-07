import { useMemo } from 'react';
import useWeb3Provider from './useWeb3Provider';

import {
    getBep20Contract,
    getBuildBurnSystemContract,
    getCollateralSystemContract,
    getExchangeSystemContract,
    getDebtSystemContract,
    getConfigContract,
    getLiquidationContract,
    getPricesContract,
    getRouterContract,
    getPancakeFactoryContract,
    getMinerRewardContract
} from '@/utils/contractHelper';

export const useERC20 = (address: string) => {
    const provider = useWeb3Provider();
    return useMemo(() => getBep20Contract(address, provider.getSigner()), [
        address,
        provider,
    ]);
};

export const useBuildBurnSystem = () => {
    const provider = useWeb3Provider();
    return useMemo(() => getBuildBurnSystemContract(provider.getSigner()), [
        provider,
    ]);
};

export const useCollateralSystem = () => {
    const provider = useWeb3Provider();
    return useMemo(() => getCollateralSystemContract(provider.getSigner()), [
        provider,
    ]);
};

export const useExchangeSystem = () => {
    const provider = useWeb3Provider();
    return useMemo(() => getExchangeSystemContract(provider.getSigner()), [
        provider,
    ]);
};

export const useDebtSystem = () => {
    const provider = useWeb3Provider();
    return useMemo(() => getDebtSystemContract(provider.getSigner()), [
        provider,
    ]);
};

export const useConfig = () => {
    const provider = useWeb3Provider();
    return useMemo(() => getConfigContract(provider.getSigner()), [provider]);
};

export const useLiquidation = () => {
    const provider = useWeb3Provider();
    return useMemo(() => getLiquidationContract(provider.getSigner()), [
        provider,
    ]);
};

export const usePrices = () => {
    const provider = useWeb3Provider();
    return useMemo(() => getPricesContract(provider.getSigner()), [provider]);
};

export const useRouter = () => {
    const provider = useWeb3Provider();
    return useMemo(() => getRouterContract(provider.getSigner()), [provider]);
};

export const usePancakeFactory = () => {
    const provider = useWeb3Provider();
    return useMemo(() => getPancakeFactoryContract(provider.getSigner()), [
        provider,
    ]);
};

export const useMinerReward = () => {
    const provider = useWeb3Provider();
    return useMemo(() => getMinerRewardContract(provider.getSigner()), [
        provider,
    ]);
};