import { useState } from 'react';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import {
    getMinerRewardContract,
    getBep20Contract,
    getContract,
} from '@/utils/contractHelper';
import { ethers } from 'ethers';
import { expandTo18Decimals } from '@/utils/bigNumber';
import Addresses from '@/config/constants/contracts';
import Tokens from '@/config/constants/tokens';
import PancakePair from '@/config/abi/PancakePair.json';
import { usePrices } from '@/hooks/useContract';
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
    const prices = usePrices();

    const getTokenPrice = async (token: string) => {
        if (!token) return 0;
        const res = await prices.getPrice(
            ethers.utils.formatBytes32String(token),
        );
        return parseFloat(ethers.utils.formatEther(res));
    };

    const getLpPrice = async (lpToken: string) => {
        const chainId = process.env.APP_CHAIN_ID;
        const lpObj = Tokens[lpToken];
        const [token0, token1] = lpToken.split('-');
        const token0Obj = Tokens[token0];
        const token1Obj = Tokens[token1];
        if (!lpObj || !token0Obj || !token1Obj) {
            throw new Error(
                'Wrong lp token ' + lpToken + ', ' + token0 + ', ' + token1,
            );
        }

        const lpContract = lpObj.address[chainId];
        const lp = getContract(PancakePair, lpContract, provider.getSigner());

        const total = parseFloat(
            ethers.utils.formatEther(await lp.totalSupply()),
        );
        const token1Address = await lp.token0();
        const token2Address = await lp.token1();
        const [r0, r1] = await lp.getReserves();
        const reserve1 = parseFloat(ethers.utils.formatEther(r0));
        const reserve2 = parseFloat(ethers.utils.formatEther(r1));
        let lpPrice;
        if (token0Obj.address[chainId] === token1Address) {
            const price0 = await getTokenPrice(token0);
            const price1 = await getTokenPrice(token1);
            lpPrice = (reserve1 * price0 + reserve2 * price1) / total;
        } else {
            const price0 = await getTokenPrice(token1);
            const price1 = await getTokenPrice(token0);
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
        const minerReward = getMinerRewardContract(provider);
        const lpAddress = await minerReward.stakeTokens(poolId);
        const lpContract = getBep20Contract(lpAddress, provider);
        const totalStaked = parseFloat(
            ethers.utils.formatEther(
                await lpContract.balanceOf(minerRewardAddress),
            ),
        );
        const userInfo = await minerReward.userInfo(poolId, account);
        const staked = parseFloat(ethers.utils.formatEther(userInfo.amount));
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

        const poolInfo = await minerReward.poolInfo(poolId);
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
        const rewardPrice = await getTokenPrice('IFT');
        const BSC_BLOCK_TIME = 5; // 5 seconds per block
        const apy =
            ((allocPoint / totalAllocPoint) *
                ((rewardPerBlock * rewardPrice) / lpPrice) *
                3600 *
                24 *
                365) /
            BSC_BLOCK_TIME;
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
        tokens: { poolName: string; poolId: number }[],
        account: string,
    ) => {
        const list = await Promise.all(
            tokens.map((token) =>
                fetchStakePoolData(token.poolName, token.poolId, account),
            ),
        );
        setStakeDataList(list);
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
    return {
        stakeDataList,
        setStakeDataList,
        currentStakePool,
        setCurrentStakePool,
        fetchStakePoolData,
        fetchStakePoolList,
        updateStakePoolItem,
    };
};

export default useStakeDataModel;
