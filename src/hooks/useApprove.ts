import { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers, Contract } from 'ethers';
import BigNumber from 'bignumber.js';
import { useERC20 } from '@/hooks/useContract';
import useLastUpdated from '@/hooks/useLastUpdated';
// import { message } from 'antd';
import * as message from '@/components/Notification';
import Token from '@/config/constants/tokens';
import useProvider from '@/hooks/useWeb3Provider';

// Approve erc20
export const useERC20Approve = (
    address: string,
    spender: string,
    setLastUpdated: () => void,
) => {
    const [requestedApproval, setRequestedApproval] = useState(false);
    if (!address.startsWith('0x') && Token[address]) {
        const token = Token[address];
        address = token.address[process.env.APP_CHAIN_ID];
    }
    const erc20 = useERC20(address);

    const handleApprove = async () => {
        const tx = await erc20.approve(spender, ethers.constants.MaxUint256);
        setRequestedApproval(true);
        const receipt = await tx.wait();
        if (receipt.status) {
            message.success('approve successed');
            setLastUpdated();
            setRequestedApproval(false);
        } else {
            message.error(
                'Please try again. Confirm the transaction and make sure you are paying enough gas!',
            );
            setRequestedApproval(false);
        }
    };

    return { handleApprove, requestedApproval };
};

export const useCheckERC20ApprovalStatus = (
    address: string,
    spender: string,
) => {
    const [isApproved, setIsApproved] = useState(false);
    const { account } = useWeb3React();
    const provider = useProvider();
    const { lastUpdated, setLastUpdated } = useLastUpdated();
    if (!address.startsWith('0x') && Token[address]) {
        const token = Token[address];
        address = token.address[process.env.APP_CHAIN_ID];
    }
    const erc20 = useERC20(address);
    useEffect(() => {
        const checkApprovalStatus = async () => {
            try {
                const response = await erc20.allowance(account, spender);
                const currentAllowance = new BigNumber(response.toString());
                setIsApproved(currentAllowance.gt(0));
            } catch (error) {
                console.log('checkApprovalStatus: ', error, account, address);
                setIsApproved(false);
            }
        };
        if (account) {
            checkApprovalStatus();
        }
    }, [account, erc20, spender, address, lastUpdated, provider]);

    return { isApproved, setLastUpdated };
};
