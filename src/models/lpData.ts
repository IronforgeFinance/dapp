import { useState } from 'react';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import { getContract } from '@/utils/contractHelper';
import { ethers } from 'ethers';
import { expandTo18Decimals } from '@/utils/bigNumber';
import PancakePair from '@/config/abi/PancakePair.json';
import Tokens from '@/config/constants/tokens';

export interface ILpDataProps {
    symbol: string;
    balance: number;
    token1: string;
    token2: string;
    token1Balance: number;
    token2Balance: number;
    token1Price: number;
    token2Price: number;
    share: string;
}
const useLpDataModel = () => {
    const [lpDataList, setLpDataList] = useState<ILpDataProps>();
    const provider = useWeb3Provider();
    const fetchLpDataInfo = async (lpToken: string, account: string) => {
        const chainId = process.env.APP_CHAIN_ID;
        const lpObj = Tokens[lpToken];
        if (!lpObj) {
            throw new Error('Wrong lp token');
        }
        const lpContract = lpObj.address[chainId];
        const lp = getContract(PancakePair, lpContract, provider.getSigner());

        const [r0, r1] = await lp.getReserves();
        console.log('r0: ', ethers.utils.formatEther(r0));
        console.log('r1: ', ethers.utils.formatEther(r1));
        const token1 = lpToken.split('-')[0];
        const token2 = lpToken.split('0')[1];
        const token1Balance = ethers.utils.formatEther(r0);
        const token2Balance = ethers.utils.formatEther(r1);

        const total = ethers.utils.formatEther(await lp.totalSupply());
        const balance = ethers.utils.formatEther(await lp.balanceOf(account));
        console.log('total: ', total);
        console.log('balance: ', balance);

        const shareVal = (parseFloat(balance) * 100) / parseFloat(total);
        const share = shareVal < 0.01 ? '<0.01%' : shareVal + '%';
        const value1 = r0.mul(expandTo18Decimals(1)).div(r1);
        const value2 = r1.mul(expandTo18Decimals(1)).div(r0);
        const token1Price = Number(ethers.utils.formatUnits(value1, 18));
        const token2Price = Number(ethers.utils.formatUnits(value2, 18));
        return {
            symbole: lpToken,
            token1,
            token2,
            token1Balance,
            token2Balance,
            token1Price,
            token2Price,
            share,
        };
    };

    return {
        lpDataList,
        setLpDataList,
        fetchLpDataInfo,
    };
};

export default useLpDataModel;
