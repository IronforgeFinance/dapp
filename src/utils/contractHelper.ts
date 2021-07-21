import { ethers } from 'ethers';
import { simpleRpcProvider } from '@/utils/providers';
import Addresses from '@/config/constants/contracts';
import {
    getAddress,
    getCakeAddress,
    getMasterChefAddress,
} from './addressHelper';

import bep20Abi from '@/config/abi/erc20.json';
import buildBurnSystemAbi from '@/config/abi/BuildBurnSystem.json';
import collateralSystemAbi from '@/config/abi/CollateralSystem.json';
import exchangeSystemAbi from '@/config/abi/ExchangeSystem.json';
import DebtSystemAbi from '@/config/abi/DebtSystem.json';
const getContract = (
    abi: any,
    address: string,
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
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
