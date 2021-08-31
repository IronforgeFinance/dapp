export interface Address {
    // "97"?: string
    // "56": string
    [key: string]: string;
}

export enum ProgressBarType {
    staked = 'staked',
    locked_ftoken = 'locked_ftoken',
    active_debt = 'active_debt',
    f_ratio = 'f_ratio',
}

export type FiatSymbol = '$' | '¥';

export type DefiActType = 'Mint' | 'Burn' | 'Trade' | 'Pool' | 'Farm';
