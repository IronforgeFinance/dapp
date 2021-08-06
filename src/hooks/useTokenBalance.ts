import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { getBep20Contract } from '@/utils/contractHelper';
import { BIG_ZERO } from '@/utils/bigNumber';
import { simpleRpcProvider } from '@/utils/providers';
import useRefresh from './useRefresh';
import useLastUpdated from './useLastUpdated';
import useWeb3Provider from './useWeb3Provider';
import Tokens from '@/config/constants/tokens';
import { ethers } from 'ethers';
import { useERC20 } from './useContract';
type UseTokenBalanceState = {
    balance: BigNumber | string | number;
    fetchStatus: FetchStatus;
};

export enum FetchStatus {
    NOT_FETCHED = 'not-fetched',
    SUCCESS = 'success',
    FAILED = 'failed',
}

const useTokenBalance = (tokenAddress: string) => {
    const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus;
    const [balanceState, setBalanceState] = useState<UseTokenBalanceState>({
        balance: BIG_ZERO,
        fetchStatus: NOT_FETCHED,
    });
    const { account } = useWeb3React();
    const { fastRefresh } = useRefresh();

    const contract = useERC20(tokenAddress);

    useEffect(() => {
        const fetchBalance = async () => {
            // const contract = getBep20Contract(tokenAddress);
            try {
                const res = await contract.balanceOf(account);
                setBalanceState({
                    balance: new BigNumber(res.toString()),
                    fetchStatus: SUCCESS,
                });
            } catch (e) {
                console.error(e);
                setBalanceState((prev) => ({
                    ...prev,
                    fetchStatus: FAILED,
                }));
            }
        };

        if (account) {
            fetchBalance();
        }
    }, [account, tokenAddress, fastRefresh, SUCCESS, FAILED]);

    return balanceState;
};

export const useBep20Balance = (token: string) => {
    const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus;
    const [balanceState, setBalanceState] = useState<UseTokenBalanceState>({
        balance: 0,
        fetchStatus: NOT_FETCHED,
    });
    const { account } = useWeb3React();
    const { fastRefresh } = useRefresh();
    const provider = useWeb3Provider();

    // const tokenObj = Tokens[token];
    // const contract = useERC20(tokenObj.address[process.env.APP_CHAIN_ID]);
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const tokenObj = Tokens[token];
                const address = tokenObj.address[process.env.APP_CHAIN_ID];
                const contract = getBep20Contract(
                    address,
                    provider.getSigner(),
                );
                const res = await contract.balanceOf(account);
                const amount = parseFloat(
                    ethers.utils.formatUnits(res, tokenObj.decimals),
                );
                setBalanceState({
                    balance: amount,
                    fetchStatus: SUCCESS,
                });
            } catch (e) {
                console.error(e);
                setBalanceState((prev) => ({
                    ...prev,
                    fetchStatus: FAILED,
                }));
            }
        };

        if (account && token) {
            fetchBalance();
        }
    }, [account, token, fastRefresh, SUCCESS, FAILED, provider]);

    return balanceState;
};


export const useBurnedBalance = (tokenAddress: string) => {
    const [balance, setBalance] = useState(BIG_ZERO);
    const { slowRefresh } = useRefresh();

    useEffect(() => {
        const fetchBalance = async () => {
            const contract = getBep20Contract(tokenAddress);
            const res = await contract.balanceOf(
                '0x000000000000000000000000000000000000dEaD',
            );
            setBalance(new BigNumber(res.toString()));
        };

        fetchBalance();
    }, [tokenAddress, slowRefresh]);

    return balance;
};

export const useGetBnbBalance = () => {
    const [balance, setBalance] = useState(BIG_ZERO);
    const { account } = useWeb3React();
    const { lastUpdated, setLastUpdated } = useLastUpdated();

    useEffect(() => {
        const fetchBalance = async () => {
            const walletBalance = await simpleRpcProvider.getBalance(account);
            setBalance(new BigNumber(walletBalance.toString()));
        };

        if (account) {
            fetchBalance();
        }
    }, [account, lastUpdated, setBalance]);

    return { balance, refresh: setLastUpdated };
};

export const useFtokenPrice = () => {
    const [price, setPrice] = useState(1.2); // for test
    const [rate, setRate] = useState('+10.3%'); // for test
    const { slowRefresh } = useRefresh();

    useEffect(() => {
        const fetchFtokenPrice = async () => {
            //fetch price from some service
        };
        fetchFtokenPrice();
    }, [slowRefresh]);
    return { price, rate };
};

export default useTokenBalance;
