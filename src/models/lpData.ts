import { useState } from 'react';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import { getContract } from '@/utils/contractHelper';
import { ethers } from 'ethers';
import { expandTo18Decimals } from '@/utils/bigNumber';
import PancakePair from '@/config/abi/PancakePair.json';
import Tokens from '@/config/constants/tokens';

export interface ILpDataToken {
    balance: number;
    price: number;
}
export interface ILpDataProps {
    symbol: string;
    balance: number;
    total: number;
    token1: string;
    token2: string;
    token1Balance: number;
    token2Balance: number;
    token1Price: number;
    token2Price: number;
    share: number;
}
const useLpDataModel = () => {
    const [lpDataList, setLpDataList] = useState<ILpDataProps[]>([]);
    const [currentLpData, setCurrentLpData] = useState<ILpDataProps>();
    const provider = useWeb3Provider();
    const fetchLpDataInfo = async (lpToken: string, account: string) => {
        const chainId = process.env.APP_CHAIN_ID;
        const lpObj = Tokens[lpToken];
        if (!lpObj) {
            throw new Error('Wrong lp token ' + lpToken);
        }
        const lpContract = lpObj.address[chainId];
        const lp = getContract(PancakePair, lpContract, provider.getSigner());

        const total = ethers.utils.formatEther(await lp.totalSupply());
        const balance = ethers.utils.formatEther(await lp.balanceOf(account));
        console.log('total: ', total);
        console.log('balance: ', balance);

        const shareVal = parseFloat(balance) / parseFloat(total);

        const [r0, r1] = await lp.getReserves();
        console.log('r0: ', ethers.utils.formatEther(r0));
        console.log('r1: ', ethers.utils.formatEther(r1));
        const token1 = lpToken.split('-')[0];
        const token2 = lpToken.split('-')[1];
        const token1Balance =
            parseFloat(ethers.utils.formatEther(r0)) * shareVal;
        const token2Balance =
            parseFloat(ethers.utils.formatEther(r1)) * shareVal;

        const value1 = r1.mul(expandTo18Decimals(1)).div(r0);
        const value2 = r0.mul(expandTo18Decimals(1)).div(r1);
        const token1Price = Number(ethers.utils.formatUnits(value1, 18));
        const token2Price = Number(ethers.utils.formatUnits(value2, 18));
        const res: ILpDataProps = {
            symbol: lpToken,
            balance: parseFloat(balance),
            total: parseFloat(total),
            token1,
            token2,
            token1Balance: parseFloat(token1Balance),
            token2Balance: parseFloat(token2Balance),
            token1Price,
            token2Price,
            share: shareVal,
        };
        console.log(res);
        return res;
    };

    const fetchLpDataList = async (lpTokens: string[], account: string) => {
        const list: ILpDataProps[] = await Promise.all(
            lpTokens.map((token) => fetchLpDataInfo(token, account)),
        );
        setLpDataList(list);
    };

    return {
        lpDataList,
        setLpDataList,
        fetchLpDataInfo,
        fetchLpDataList,
        currentLpData,
        setCurrentLpData,
    };
};

export default useLpDataModel;
