import * as Constants from '@/config/constants/constant';
import addresses from '@/config/constants/contracts';
import tokens from '@/config/constants/tokens';
import { Address } from '@/config/constants/types';

export const getAddress = (address: Address): string => {
    const chainId = process.env.APP_CHAIN_ID;
    return address[chainId!] ? address[chainId!] : address[Constants.MAINNET];
};

export const getCakeAddress = () => {
    return getAddress(tokens.cake.address);
};

export const getMasterChefAddress = () => {
    return getAddress(addresses.masterChef)
}

