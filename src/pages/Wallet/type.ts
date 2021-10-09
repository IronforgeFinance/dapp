export type PriceTypes = '$' | '¥';

export type RouteType = 'Mint' | 'Burn' | 'Trade';

export type OperationType = 'Mint' | 'Burn' | 'Trade' | 'Pool' | 'Farm';

export type PoolType = 'Provide' | 'Withdraw';

export type ChainIds = '1337' | '97' | '56';

export interface PoolData {
    token0: TokenData;
    token1: TokenData;
    staked?: {
        amount: number;
        price: PriceData;
    };
    earned?: {
        token0: TokenData;
        token1: TokenData;
    };
    apy?: number | string;
}

export interface TokenData {
    amount: number;
    token: string;
    price?: PriceData;
    balance?: PriceData;
    route?: RouteType;
    ratio?: number | string;
}

export interface PriceData {
    amount: number;
    symbol: PriceTypes;
}

export interface OperationData {
    name: OperationType;
    datetime: string;
    token0?: TokenData;
    token1?: TokenData;
    type?: PoolType;
    stake?: TokenData;
}
