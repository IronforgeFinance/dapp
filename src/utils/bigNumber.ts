import { BigNumber as BN } from 'bignumber.js';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers';

export type SerializedBigNumber = string;

export const BIG_ZERO = new BN(0);
export const BIG_ONE = new BN(1);
export const BIG_NINE = new BN(9);
export const BIG_TEN = new BN(10);

export const ethersToSerializedBigNumber = (
    ethersBn: ethers.BigNumber,
): SerializedBigNumber => ethersToBigNumber(ethersBn).toJSON();

export const ethersToBigNumber = (ethersBn: ethers.BigNumber): BN =>
    new BN(ethersBn.toString());

export const toFixedWithoutRound = (num: number | BigNumber, fixed: number) => {
    var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)![0];
};

export function expandTo18Decimals(num: number | string): BigNumber {
    return expandToNDecimals(num, 18);
}

export function expandToNDecimals(num: number | string, n: number): BigNumber {
    const bigNum = new BN(num);
    const ret = bigNum.shiftedBy(n).toFixed(0, BN.ROUND_DOWN);
    return ethers.BigNumber.from(ret.toString());
}
