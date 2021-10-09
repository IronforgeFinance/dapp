import { useState } from 'react';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import { getContract, getPancakeFactoryContract } from '@/utils/contractHelper';
import { ethers } from 'ethers';
import { expandTo18Decimals, toFixedWithoutRound } from '@/utils/bigNumber';
import PancakePair from '@/config/abi/PancakePair.json';
import Tokens from '@/config/constants/tokens';
import { usePancakeFactory } from '@/hooks/useContract';

export interface ILpDataToken {
    balance: number;
    price: number;
}
export interface ILpDataProps {
    symbol: string;
    address: string;
    balance: number;
    total: number;
    reserve1: number;
    reserve2: number;
    token1: string;
    token2: string;
    token1Balance: number;
    token2Balance: number;
    token1Price: number;
    token2Price: number;
    share: number;
}
const Address0 = '0x0000000000000000000000000000000000000000';
const useLpDataModel = () => {
    const [lpDataList, setLpDataList] = useState<ILpDataProps[]>([]);
    const [currentLpData, setCurrentLpData] = useState<ILpDataProps>();
    const [lpDataToRemove, setLpDataToRemove] = useState<ILpDataProps>();

    const provider = useWeb3Provider();
    const fetchLpDataInfo = async (lpToken: string, account: string) => {
        const chainId = process.env.APP_CHAIN_ID;
        const lpObj = Tokens[lpToken];
        let token1 = lpToken.split('-')[0];
        let token2 = lpToken.split('-')[1];
        const _token1Address = Tokens[token1].address[chainId];
        const _token2Address = Tokens[token2].address[chainId];
        let lpContract = '';
        if (lpObj) {
            lpContract = lpObj.address[chainId];
        } else {
            const pancakeFactory = getPancakeFactoryContract();

            const pair = await pancakeFactory.getPair(
                _token1Address,
                _token2Address,
            );
            console.log('pair: ', pair);
            lpContract = pair;
            if (pair === Address0) {
                throw new Error('Wrong lp token ' + lpToken);
            }
        }
        const lp = getContract(PancakePair, lpContract);
        console.log('total: ', await lp.totalSupply());
        const total = ethers.utils.formatEther(await lp.totalSupply());
        const [r0, r1] = await lp.getReserves();
        console.log('r0: ', ethers.utils.formatEther(r0));
        console.log('r1: ', ethers.utils.formatEther(r1));

        const token1Address = await lp.token0();
        const token2Address = await lp.token1();
        console.log('token1Address: ', token1Address);
        console.log('token2Address: ', token2Address);
        const reserve1 = parseFloat(ethers.utils.formatEther(r0));
        const reserve2 = parseFloat(ethers.utils.formatEther(r1));
        const value1 = r1.mul(expandTo18Decimals(1)).div(r0);
        const value2 = r0.mul(expandTo18Decimals(1)).div(r1);
        const token1Price = Number(ethers.utils.formatUnits(value1, 18));
        const token2Price = Number(ethers.utils.formatUnits(value2, 18));
        if (
            _token1Address === token1Address &&
            _token2Address === token2Address
        ) {
        } else {
            [token2, token1] = [token1, token2]; // swap
        }
        if (!account) {
            const res: ILpDataProps = {
                symbol: lpToken,
                address: lpContract,
                balance: 0,
                total: parseFloat(total),
                reserve1,
                reserve2,
                token1,
                token2,
                token1Balance: 0,
                token2Balance: 0,
                token1Price,
                token2Price,
                share: 0,
            };
            return res;
        }

        const balance = ethers.utils.formatEther(await lp.balanceOf(account));
        console.log('total: ', total);
        console.log('balance: ', balance);

        const shareVal = parseFloat(balance) / parseFloat(total);

        const token1Balance = parseFloat((reserve1 * shareVal).toFixed(2));
        const token2Balance = parseFloat((reserve2 * shareVal).toFixed(2));

        const res: ILpDataProps = {
            symbol: lpToken,
            address: lpContract,
            balance: toFixedWithoutRound(balance, 2),
            total: toFixedWithoutRound(total, 2),
            reserve1,
            reserve2,
            token1,
            token2,
            token1Balance: token1Balance,
            token2Balance: token2Balance,
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
        return list;
    };

    return {
        lpDataList,
        setLpDataList,
        fetchLpDataInfo,
        fetchLpDataList,
        currentLpData,
        setCurrentLpData,
        lpDataToRemove,
        setLpDataToRemove,
    };
};

export default useLpDataModel;
