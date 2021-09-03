import dayjs from 'dayjs';
import arraySupport from 'dayjs/plugin/arraySupport';
import { getPricesContract } from '@/utils/contractHelper';
import { simpleRpcProvider } from '@/utils/providers';
import { ethers } from 'ethers';
dayjs.extend(arraySupport);
//quarter is like 202112
export const getRemainDaysOfQuarterAsset = (quarter: string) => {
    if (!quarter || !/^\d+$/.test(quarter)) return null;

    try {
        let date = dayjs([
            Number(quarter.substr(0, 4)),
            Number(quarter.substr(4)) - 1, // month starts from 0
        ]).endOf('month');
        while (date.day() !== 5) {
            date = date.subtract(1, 'days');
        }
        const days = date.diff(new Date(), 'days');
        if (date.isBefore(new Date())) {
            return -1 * days;
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
    return token.includes('-'); //quarter is like lBTC-202112
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
        const prices = getPricesContract(simpleRpcProvider);
        const res = await prices.getPrice(
            ethers.utils.formatBytes32String(token),
        );
        console.log('getTokenPrice: ', token, res);
        return parseFloat(ethers.utils.formatEther(res));
    } catch (err) {
        console.log(err);
        console.log('getTokenPrice error:', token);
        return 0;
    }
};
