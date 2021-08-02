import { useWeb3React } from '@web3-react/core';
import React, { useState, useEffect } from 'react';
import { useConfig } from '@/hooks/useContract';
import useRefresh from './useRefresh';
import { ethers } from 'ethers';
export const useInitialRatio = (currency: string) => {
    const [initialRatio, setInitialRatio] = useState(0); //TODO 不同currency有不同的ratio
    const configContract = useConfig();

    useEffect(() => {
        if (currency) {
            (async () => {
                const res = await configContract.getUint(
                    ethers.utils.formatBytes32String(currency),
                );
                const value = Number(ethers.utils.formatUnits(res, 18));
                setInitialRatio(1 / value);
                console.log('build ratio: ', 1 / value);
            })();
        }
    }, [currency]);
    return initialRatio;
};
