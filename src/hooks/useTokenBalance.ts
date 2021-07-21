import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { getBep20Contract } from '@/utils/contractHelper';
import { BIG_ZERO } from '@/utils/bigNumber';
import { simpleRpcProvider } from '@/utils/providers';
import useRefresh from './useRefresh';
import useLastUpdated from './useLastUpdated';

type UseTokenBalanceState = {
    balance: BigNumber;
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

    useEffect(() => {
        const fetchBalance = async () => {
            const contract = getBep20Contract(tokenAddress);
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
