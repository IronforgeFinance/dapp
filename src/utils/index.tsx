import dayjs from 'dayjs';
import arraySupport from 'dayjs/plugin/arraySupport';
import { getPricesContract } from '@/utils/contractHelper';
import { simpleRpcProvider } from '@/utils/providers';
import { ethers } from 'ethers';
import { PLATFORM_TOKEN } from '@/config';
import * as message from '@/components/Notification';
dayjs.extend(arraySupport);
//quarter is like 202112
export const getRemainDaysOfQuarterAsset = (quarter: string) => {
    if (!quarter || !/^\d+$/.test(quarter)) return null;

    try {
        let date = dayjs([
            Number('20' + quarter.substr(0, 2)),
            Number(quarter.substr(2, 2)) - 1, // month starts from 0
            Number(quarter.substr(4)),
        ]).endOf('month');
        while (date.day() !== 5) {
            date = date.subtract(1, 'days');
        }
        const days = date.diff(new Date(), 'days');
        if (date.isBefore(new Date())) {
            // return -1 * days;
            return 0;
        }
        console.log('remain days: ', days);
        return days;
    } catch (error) {
        console.error(error);
    }
};

//TODO 判断是否是季度合约资产。目前判断方法比较简单
export const isDeliveryAsset = (token: string) => {
    if (!token) return false;
    return /^.+((-|_)\d+)$/.test(token); //quarter is like lBTC-202112
};

/**
 * Helper Function, parse string to number
 * @param {any} value is a string or number
 */
const stringIsNumber = (value) => isNaN(Number(value)) === false;

/**
 * Parse enums to an array
 * @param {Enum}
 * @returns {Object} Keys object of enum
 */
export const parseEnumToArray = (enumme) => {
    return Object.keys(enumme)
        .filter(stringIsNumber)
        .map((key) => enumme[key]);
};

export const getTokenPrice = async (token: string) => {
    if (!token) return 0;
    try {
        if (token === 'FUSD') return 1; // TODO for test
        if (token === 'BST') token = PLATFORM_TOKEN;
        const prices = getPricesContract(simpleRpcProvider);
        const res = await prices.getPrice(
            ethers.utils.formatBytes32String(token),
        );
        console.log('getTokenPrice: ', token, ethers.utils.formatEther(res));
        return parseFloat(ethers.utils.formatEther(res));
    } catch (err) {
        console.log(err);
        console.log('getTokenPrice error:', token);
        return 0;
    }
};

export const handleTxSent = async (tx: any, intl: any) => {
    console.log(tx);
    message.success({
        message: intl.formatMessage({ id: 'txSent' }),
        description: intl.formatMessage({ id: 'txSentSuccess' }),
    });

    const receipt = await tx.wait();
    console.log(receipt);
    message.success({
        message: intl.formatMessage({ id: 'txReceived' }),
        description: intl.formatMessage({
            id: 'txReceivedSuccess',
        }),
        scanHref: `${process.env.BSC_SCAN_URL}/tx/${tx.hash}`,
    });
};

let CollateralTokens = [];
export const getCollateralTokens = async () => {
    if (CollateralTokens.length > 0) return CollateralTokens;
};
