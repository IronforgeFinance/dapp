import { useMemo } from 'react';
import useWeb3Provider from './useWeb3Provider';

import {
    getBep20Contract,
    getBuildBurnSystemContract,
    getCollateralSystemContract,
    getExchangeSystemContract,
} from '@/utils/contractHelper';

export const useERC20 = (address: string) => {
    const provider = useWeb3Provider();
    return useMemo(
        () => getBep20Contract(address, provider.getSigner()),
        [address, provider],
    );
};

export const useBuildBurnSystem = () => {
    const provider = useWeb3Provider();
    return useMemo(
        () => getBuildBurnSystemContract(provider.getSigner()),
        [provider],
    );
};

export const useCollateralSystem = () => {
    const provider = useWeb3Provider();
    return useMemo(
        () => getCollateralSystemContract(provider.getSigner()),
        [provider],
    );
};

export const useExchangeSystem = () => {
    const provider = useWeb3Provider();
    return useMemo(
        () => getExchangeSystemContract(provider.getSigner()),
        [provider],
    );
};
