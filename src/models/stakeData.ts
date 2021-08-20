import { useState } from 'react';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import {
    getMinerRewardContract,
    getBep20Contract,
} from '@/utils/contractHelper';
import { ethers } from 'ethers';
import { expandTo18Decimals } from '@/utils/bigNumber';
import Addresses from '@/config/constants/contracts';

// apy = ap/totalAp * rewardPerBlock
export interface IStakePool {
    name: string; // USDC-IFT
    lpAddress: string;
    apy: number;
    totalStaked: number;
    poolId: number;
    staked: number;
    totalPendingReward: number;
    redeemableReward: number;
}

const useStakeDataModel = () => {
    const [stakeDataList, setStakeDataList] = useState<IStakePool[]>([]);
    const [currentStakePool, setCurrentStakePool] = useState<IStakePool>();
    const provider = useWeb3Provider();

    const fetchStakePoolData = async (
        poolName: string,
        poolId: number,
        account: string,
    ) => {
        const chainId = process.env.APP_CHAIN_ID;
        const minerRewardAddress = Addresses.MinerReward[chainId];
        const minerReward = getMinerRewardContract(provider);
        const lpAddress = await minerReward.stakeTokens(poolId);
        const lpContract = getBep20Contract(lpAddress, provider);
        const totalStaked = parseFloat(
            ethers.utils.formatEther(
                await lpAddress.balanceOf(minerRewardAddress),
            ),
        );
        const userInfo = await minerReward.userInfo(poolId, account);
        const staked = userInfo.amount;
        const totalPendingReward = parseFloat(
            ethers.utils.formatEther(
                await minerReward.totalPendingReward(poolId, account),
            ),
        );
        const redeemableReward = parseFloat(
            ethers.utils.formatEther(
                await minerReward.redeemaleReward(poolId, account),
            ),
        );
        //TODO
        const apy = 1;
        const data: IStakePool = {
            name: poolName,
            poolId,
            lpAddress,
            apy,
            staked,
            totalStaked,
            totalPendingReward,
            redeemableReward,
        };
        console.log(data);
        return data;
    };

    const fetchStakePoolList = async (
        tokens: { poolNameL: string; poolId: number }[],
        account: string,
    ) => {
        const list = await Promise.all(
            tokens.map((token) =>
                fetchStakePoolData(token.poolNameL, token.poolId, account),
            ),
        );
        setStakeDataList(list);
    };
    return {
        stakeDataList,
        setStakeDataList,
        currentStakePool,
        setCurrentStakePool,
        fetchStakePoolData,
        fetchStakePoolList,
    };
};
