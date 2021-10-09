import React, { useState, useEffect } from 'react';
import { usePrices } from '@/hooks/useContract';
import useRefresh from './useRefresh';
import { ethers } from 'ethers';
export const useTokenPrice = (currency: string) => {
    const [price, setPrice] = useState(0);
    const prices = usePrices();
    const { fastRefresh } = useRefresh();

    useEffect(() => {
        if (currency) {
            (async () => {
                const res = await prices.getPrice(
                    ethers.utils.formatBytes32String(currency),
                );
                const val = parseFloat(ethers.utils.formatEther(res));
                setPrice(val);
            })();
        }
    }, [currency, fastRefresh]);
    return price;
};
