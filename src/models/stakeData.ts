import { useState } from 'react';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import {
    getMinerRewardContract,
    getBep20Contract,
    getContract,
} from '@/utils/contractHelper';
import { ethers } from 'ethers';
import { expandTo18Decimals, toFixedWithoutRound } from '@/utils/bigNumber';
import Addresses from '@/config/constants/contracts';
import Tokens from '@/config/constants/tokens';
import PancakePair from '@/config/abi/PancakePair.json';
import { usePrices } from '@/hooks/useContract';
import { getTokenPrice } from '@/utils/index';
import { LP_TOKENS, PLATFORM_TOKEN } from '@/config';

// apy = ap/totalAp * rewardPerBlock
export interface IStakePool {
    name: string; // USDC-BST
    lpAddress: string;
    lpPrice: number;
    apy: number;
    totalStaked: number;
    poolId: number;
    staked: number;
    totalPendingReward: number;
    redeemableReward: number;
}

export const DEFAULT_POOL = {
    name: '',
    lpAddress: '',
    lpPrice: 0,
    apy: 0,
    totalStaked: 0,
    poolId: 0,
    staked: 0,
    totalPendingReward: 0,
    redeemableReward: 0,
};

const useStakeDataModel = () => {
    const [stakeDataList, setStakeDataList] = useState<IStakePool[]>([
        DEFAULT_POOL,
    ]);
    const [currentStakePool, setCurrentStakePool] = useState<IStakePool>();
    const [singleTokenPoolTotalEarned, setSingleTokenPoolTotalEarned] =
        useState(0);
    const [singleTokenPoolTotalStaked, setSingleTokenPoolTotalStaked] =
        useState(0);
    const provider = useWeb3Provider();

    const getLpPrice = async (lpToken: string) => {
        const chainId = process.env.APP_CHAIN_ID;
        const lpObj = Tokens[lpToken];
        const [token0, token1] = lpToken.split('-');
        if (token0 && !token1) {
            // 单币池子
            return getTokenPrice(lpToken);
        }
        const token0Obj = Tokens[token0];
        const token1Obj = Tokens[token1];
        if (!lpObj || !token0Obj || !token1Obj) {
            throw new Error(
                'Wrong lp token ' + lpToken + ', ' + token0 + ', ' + token1,
            );
        }

        const lpContract = lpObj.address[chainId];
        const lp = getContract(PancakePair, lpContract);

        const total = parseFloat(
            ethers.utils.formatEther(await lp.totalSupply()),
        );
        const token1Address = await lp.token0();
        const token2Address = await lp.token1();
        const [r0, r1] = await lp.getReserves();
        const reserve1 = parseFloat(ethers.utils.formatEther(r0));
        const reserve2 = parseFloat(ethers.utils.formatEther(r1));
        let lpPrice;
        const price0 = await getTokenPrice(token0);
        const price1 = await getTokenPrice(token1);
        console.log('price01: ', price0, price1);
        if (token0Obj.address[chainId] === token1Address) {
            lpPrice = (reserve1 * price0 + reserve2 * price1) / total;
        } else {
            lpPrice = (reserve2 * price0 + reserve1 * price1) / total;
        }
        return lpPrice;
    };

    const fetchStakePoolData = async (
        poolName: string,
        poolId: number,
        account: string,
    ) => {
        const chainId = process.env.APP_CHAIN_ID;
        const minerRewardAddress = Addresses.MinerReward[chainId];
        const minerReward = getMinerRewardContract();
        const poolInfo = await minerReward.poolInfo(poolId);
        const lpAddress = poolInfo.stakeToken;
        const lpContract = getBep20Contract(lpAddress, provider);
        const totalStakedVal = parseFloat(
            ethers.utils.formatEther(poolInfo.amount),
        );

        const allocPoint = parseFloat(
            ethers.utils.formatEther(poolInfo.allocPoint),
        );
        const totalAllocPoint = parseFloat(
            ethers.utils.formatEther(await minerReward.totalAllocPoint()),
        );
        const rewardPerBlock = parseFloat(
            ethers.utils.formatEther(await minerReward.rewardPerBlock()),
        );
        const lpPrice = await getLpPrice(poolName);
        console.log('lpPrice of: ', poolName, lpPrice);
        const totalStakedLpVal = lpPrice * totalStakedVal;
        const totalStaked = Number((totalStakedVal * lpPrice).toFixed(2));
        const rewardPrice = await getTokenPrice('BST');
        const BSC_BLOCK_TIME = 5; // 5 seconds per block
        // rate per day
        const apr =
            ((((allocPoint / totalAllocPoint) *
                (rewardPerBlock * rewardPrice)) /
                totalStakedLpVal) *
                3600 *
                24) /
            BSC_BLOCK_TIME;
        const apy = Math.pow(1 + apr / 365, 365) - 1;
        if (!account) {
            const data: IStakePool = {
                name: poolName,
                poolId,
                lpAddress,
                lpPrice,
                apy,
                staked: 0,
                totalStaked,
                totalPendingReward: 0,
                redeemableReward: 0,
            };
            return data;
        }
        const userInfo = await minerReward.userInfo(poolId, account);
        const staked = parseFloat(ethers.utils.formatEther(userInfo.amount));
        const totalPendingReward = toFixedWithoutRound(
            ethers.utils.formatEther(
                await minerReward.totalPendingReward(poolId, account),
            ),
            2,
        );
        const redeemableReward = toFixedWithoutRound(
            ethers.utils.formatEther(
                await minerReward.redeemaleReward(poolId, account),
            ),
            2,
        );

        const data: IStakePool = {
            name: poolName,
            poolId,
            lpAddress,
            lpPrice,
            apy,
            staked,
            totalStaked,
            totalPendingReward,
            redeemableReward,
        };
        return data;
    };

    const fetchStakePoolList = async (
        tokens: { poolName: string; poolId: number }[],
        account?: string,
    ) => {
        const list = await Promise.all(
            tokens.map((token) =>
                fetchStakePoolData(token.poolName, token.poolId, account),
            ),
        );
        setStakeDataList(list);
        console.log(list);
        return list;
    };

    const updateStakePoolItem = async (
        token: { poolName: string; poolId: number },
        account,
    ) => {
        const info = await fetchStakePoolData(
            token.poolName,
            token.poolId,
            account,
        );
        const index = stakeDataList.findIndex(
            (item) => item.name === token.poolName,
        );
        const newList = [...stakeDataList];
        newList[index] = info;
        setStakeDataList(newList);
    };

    const fetchSingleTokenPoolTotalEarned = async (
        tokens: { poolName: string; poolId: number }[],
    ) => {
        let total = 0;
        const minerReward = getMinerRewardContract(provider);
        // const block = await provider.getBlockNumber();
        // const totalAllocPoint = parseFloat(
        //     ethers.utils.formatEther(await minerReward.totalAllocPoint()),
        // );
        // const rewardPerBlock = parseFloat(
        //     ethers.utils.formatEther(await minerReward.rewardPerBlock()),
        // );
        // console.log('current block: ', block);

        for (let i = 0; i < tokens.length; i++) {
            // const userInfo = await minerReward.userInfo()
            const poolInfo = await minerReward.poolInfo(tokens[i].poolId);
            // const lastRewardBlock = parseFloat(poolInfo.lastRewardBlock);
            // const allocPoint = parseFloat(
            //     ethers.utils.formatEther(poolInfo.allocPoint),
            // );
            // const reward =
            //     ((block - lastRewardBlock) * rewardPerBlock * allocPoint) /
            //     totalAllocPoint;
            const poolReward = poolInfo.amount
                .mul(poolInfo.accRewardPerShare)
                .div(1e12);

            total += parseFloat(ethers.utils.formatEther(poolReward));
        }
        const price = await getTokenPrice(PLATFORM_TOKEN);
        const val = toFixedWithoutRound(total * price, 6);
        setSingleTokenPoolTotalEarned(val);
        return val;
    };

    return {
        stakeDataList,
        setStakeDataList,
        currentStakePool,
        setCurrentStakePool,
        fetchStakePoolData,
        fetchStakePoolList,
        updateStakePoolItem,
        singleTokenPoolTotalEarned,
        fetchSingleTokenPoolTotalEarned,
    };
};

export default useStakeDataModel;
