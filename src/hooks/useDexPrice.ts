import { useWeb3React } from '@web3-react/core';
import React, { useState, useEffect } from 'react';
import useRefresh from './useRefresh';
import { usePancakeFactory } from '@/hooks/useContract';
import { ethers } from 'ethers';
import Tokens from '@/config/constants/tokens';
import useWeb3Provider from './useWeb3Provider';
import { getContract } from '@/utils/contractHelper';
import { expandTo18Decimals } from '@/utils/bigNumber';
import PancakePair from '@/config/abi/PancakePair.json';
const useDexPrice = (token1, token2) => {
    const [price, setPrice] = useState(0); //TODO 不同currency有不同的ratio
    const factory = usePancakeFactory();
    const { fastRefresh } = useRefresh();
    const provider = useWeb3Provider();

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
                const lpPairAddress = await factory.getPair(
                    token1Contract,
                    token2Contract,
                );

                console.log('lp pair: ', lpPairAddress);
                const lp = getContract(
                    PancakePair,
                    lpPairAddress,
                    provider.getSigner(),
                );

                const [r0, r1] = await lp.getReserves();
                console.log('r0: ', ethers.utils.formatEther(r0));
                console.log('r1: ', ethers.utils.formatEther(r1));

                const total = await lp.totalSupply();
                console.log('total: ', ethers.utils.formatEther(total));

                let value;
                if (token1Contract === (await lp.token0())) {
                    value = r1.mul(expandTo18Decimals(1)).div(r0);
                } else {
                    value = r0.mul(expandTo18Decimals(1)).div(r1);
                }
                value = Number(ethers.utils.formatUnits(value, 18));
                console.log('dex price: ', value);
                setPrice(value);
            })();
        }
    }, [token1, token1, fastRefresh, provider]);
    return price;
};

export default useDexPrice;
