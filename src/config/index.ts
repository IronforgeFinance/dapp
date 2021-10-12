export const BASE_BSC_SCAN_URL = 'https://bscscan.com';
//TODO 从配置或者合约中获取
export const COLLATERAL_TOKENS = [
    {
        name: 'USDC',
    },
    {
        name: 'BTC',
    },
    {
        name: 'ETH',
    },
    {
        name: 'USDT',
    },
];

//TODO 从配置或者合约中获取
export const MINT_TOKENS = ['FUSD', 'lBTC', 'lBTCUSD_210924', 'lBTCUSD_211231'];

//TODO 从配置或者合约中获取
export const DELIVERY_TOKENS = ['lBTCUSD_210924', 'lBTCUSD_211231'];

// TODO 从后台接口或合约中获取.
export const POOL_TOKENS = [{ poolName: 'BS', poolId: 1 }];

// TODO 从后台接口或合约中获取.
export const LP_TOKENS = [
    { poolName: 'USDC-IFT', poolId: 2 }, // 前两个池子是BS的池子，lp的name只能写死配置
    { poolName: 'USDC-ETH', poolId: 3 },
];

//TODO 配置中读取官方预先添加的流动性lp
export const PROVIDED_LP_TOKENS = ['USDC-ETH', 'USDC-IFT'];

//TODO to be updated
export const PLATFORM_TOKEN = 'IFT';
