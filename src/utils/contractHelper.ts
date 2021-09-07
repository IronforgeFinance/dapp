import { ethers } from 'ethers';
import { simpleRpcProvider } from '@/utils/providers';
import Addresses from '@/config/constants/contracts';
import {
    getAddress,
    getCakeAddress,
    getMasterChefAddress,
} from './addressHelper';

import bep20Abi from '@/config/abi/ERC20.json';
import buildBurnSystemAbi from '@/config/abi/BuildBurnSystem.json';
import collateralSystemAbi from '@/config/abi/CollateralSystem.json';
import exchangeSystemAbi from '@/config/abi/ExchangeSystem.json';
import DebtSystemAbi from '@/config/abi/DebtSystem.json';
import ConfigAbi from '@/config/abi/Config.json';
import LiquidationAbi from '@/config/abi/Liquidation.json';
import PricesAbi from '@/config/abi/MockPrices.json';
import PancakeRouter from '@/config/abi/PancakeRouterV2.json';
import PancakeFactory from '@/config/abi/PancakeFactory.json';
import MinerReward from '@/config/abi/MinerReward.json';

export const getContract = (
    abi: any,
    address: string,
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    if (!address) return null;
    const signerOrProvider = signer ?? simpleRpcProvider;
    return new ethers.Contract(address, abi, signerOrProvider);
};

export const getBep20Contract = (
    address: string,
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    return getContract(bep20Abi, address, signer);
};

export const getBuildBurnSystemContract = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    const chainId = process.env.APP_CHAIN_ID as string;
    const address = Addresses.BuildBurnSystem[chainId];
    return getContract(buildBurnSystemAbi, address, signer);
};

export const getCollateralSystemContract = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    const chainId = process.env.APP_CHAIN_ID as string;
    const address = Addresses.CollateralSystem[chainId];
    return getContract(collateralSystemAbi, address, signer);
};

export const getExchangeSystemContract = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    const chainId = process.env.APP_CHAIN_ID as string;
    const address = Addresses.ExchangeSystem[chainId];
    return getContract(exchangeSystemAbi, address, signer);
};

export const getDebtSystemContract = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    const chainId = process.env.APP_CHAIN_ID as string;
    const address = Addresses.DebtSystem[chainId];
    return getContract(DebtSystemAbi, address, signer);
};

export const getConfigContract = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    const chainId = process.env.APP_CHAIN_ID as string;
    const address = Addresses.Config[chainId];
    return getContract(ConfigAbi, address, signer);
};

export const getLiquidationContract = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    const chainId = process.env.APP_CHAIN_ID as string;
    const address = Addresses.Liquidation[chainId];
    return getContract(LiquidationAbi, address, signer);
};

export const getPricesContract = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    const chainId = process.env.APP_CHAIN_ID as string;
    const address = Addresses.Prices[chainId];
    return getContract(PricesAbi, address, signer);
};

export const getRouterContract = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    const chainId = process.env.APP_CHAIN_ID as string;
    const address = Addresses.PancakeRouter[chainId];
    return getContract(PancakeRouter, address, signer);
};

export const getPancakeFactoryContract = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    const chainId = process.env.APP_CHAIN_ID as string;
    const address = Addresses.PancakeFactory[chainId];
    return getContract(PancakeFactory, address, signer);
};

export const getMinerRewardContract = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    const chainId = process.env.APP_CHAIN_ID as string;
    const address = Addresses.MinerReward[chainId];
    return getContract(MinerReward, address, signer);
};
