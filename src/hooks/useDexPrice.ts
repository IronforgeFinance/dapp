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

                const lp = getContract(
                    PancakePair,
                    lpPairAddress,
                    provider.getSigner(),
                );

                const [r0, r1] = await lp.getReserves();
                let value;
                if (token1Contract === (await lp.token0())) {
                    value = r0.mul(expandTo18Decimals(1)).div(r1);
                } else {
                    value = r1.mul(expandTo18Decimals(1)).div(r0);
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
