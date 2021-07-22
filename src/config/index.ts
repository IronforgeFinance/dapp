export const BASE_BSC_SCAN_URL = 'https://bscscan.com';

export const COLLATERAL_TOKENS = [
    {
        name: 'USDT',
        ratio: 5, // TODO get ratio from contract
    },
    {
        name: 'BTC',
        ratio: 5,
    },
    {
        name: 'ETH',
        ratio: 5,
    },
];

export const MINT_TOKENS = ['fUSDT', 'fBTC', 'fETH'];

//TODO 从Prices合约接口获取质押token的价格。现在假定1fToken=1U，1BTC=5000U，1ETH=2000U
export const TokenPrices = {
    BTC: 10000,
    ETH: 1000,
    fToken: 1,
    USDT: 1,
    fBTC: 10000,
    fUSDT: 1,
    fUSD: 1,
    FUSD: 1,
    fETH: 1000,
    lBTC: 10000,
};
