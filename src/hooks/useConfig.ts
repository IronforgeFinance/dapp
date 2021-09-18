import { useWeb3React } from '@web3-react/core';
import React, { useState, useEffect } from 'react';
import { useConfig } from '@/hooks/useContract';
import useRefresh from './useRefresh';
import { ethers } from 'ethers';
import contracts from '@/config/constants/contracts';
import ConfigAbi from '@/config/abi/Config.json';
import { getConfigContract } from '@/utils/contractHelper';
import { simpleRpcProvider } from '@/utils/providers';

export const useInitialRatio = (currency) => {
    const [initialRatio, setInitialRatio] = useState(5); //TODO 不同currency有不同的ratio
    // const configContract = useConfig();
    useEffect(() => {
        if (currency) {
            (async () => {
                try {
                    const configContract = getConfigContract(simpleRpcProvider);

                    const res = await configContract.getBuildRatio(
                        ethers.utils.formatBytes32String(currency),
                    );
                    const value = Number(ethers.utils.formatUnits(res, 18));
                    if (value > 0) {
                        setInitialRatio(1 / value);
                        console.log('build ratio: ', 1 / value);
                    }
                } catch (err) {
                    console.log('build ratio:', err);
                    setInitialRatio(5); //TODO 未连接钱包时报错
                }
            })();
        }
    }, [currency]);
    return initialRatio;
};
