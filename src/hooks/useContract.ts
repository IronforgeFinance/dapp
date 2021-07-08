import { useMemo } from 'react';
import useWeb3Provider from './useWeb3Provider';

import { getBep20Contract, getCakeContract } from '@/utils/contractHelper';

export const useERC20 = (address: string) => {
  const provider = useWeb3Provider();
  return useMemo(
    () => getBep20Contract(address, provider.getSigner()),
    [address, provider],
  );
};

export const useCake = () => {
  const provider = useWeb3Provider();
  return useMemo(() => getCakeContract(provider.getSigner()), [provider]);
};
