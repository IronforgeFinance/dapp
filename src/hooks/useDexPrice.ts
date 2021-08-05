import { useWeb3React } from '@web3-react/core';
import React, { useState, useEffect } from 'react';
import useRefresh from './useRefresh';
import { useRouter } from '@/hooks/useContract';
import { ethers } from 'ethers';
import Tokens from '@/config/constants/tokens';
const useDexPrice = (token1, token2) => {
    const [price, setPrice] = useState(0); //TODO 不同currency有不同的ratio
    const router = useRouter();
    const { fastRefresh } = useRefresh();

    useEffect(() => {
        if (token1 && token2) {
            (async () => {
                const chainId = process.env.APP_CHAIN_ID;
                const token1Obj = Tokens[token1];
                const token2Obj = Tokens[token2];
                if (!token1Obj || !token2Obj) {
                    throw new Error('Wrong token');
                }
                const token1Contract = token1Obj.address[chainId];
                const token2Contract = token2Obj.address[chainId];
                const [, price] = await router.getAmountsOut(
                    ethers.utils.parseEther('1'),
                    [token1Contract, token2Contract],
                );
                const value = Number(ethers.utils.formatUnits(price, 18));
                console.log('dex price: ', value);
                setPrice(value);
            })();
        }
    }, [token1, token1, fastRefresh]);
    return price;
};

export default useDexPrice;
