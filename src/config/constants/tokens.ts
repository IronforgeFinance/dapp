import { localOutput, testnetOutput } from './contracts';

export default {
    cake: {
        symbol: 'CAKE',
        address: {
            56: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', // mainnet
            97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe', // testnet
        },
        decimals: 18,
        projectLink: 'https://pancakeswap.finance/',
    },
    USDT: {
        symbol: 'USDT',
        address: {
            56: '0x55d398326f99059fF775485246999027B3197955',
            97: '0x6708eef5a96348171a0f4246aec0a33adf67fc00',
            1337: localOutput.usdtToken,
        },
        decimals: 18,
        projectLink: 'https://tether.to/',
    },
    USDC: {
        symbol: 'USDC',
        address: {
            56: '',
            97: testnetOutput.usdcToken,
            1337: localOutput.usdcToken,
        },
        decimals: 18,
        projectLink: 'https://tether.to/',
    },
    BTC: {
        symbol: 'BTCB',
        address: {
            56: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
            97: testnetOutput.btcToken,
            1337: localOutput.btcToken,
        },
        decimals: 18,
        projectLink: 'https://bitcoin.org/',
    },
    ETH: {
        symbol: 'ETH',
        address: {
            56: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
            97: '0xf02ff1287b82aabd2d441077004b60a4c4fdcbcd',
            1337: localOutput.ethToken,
        },
        decimals: 18,
        projectLink: 'https://ethereum.org/en/',
    },
    IFT: {
        symbol: 'IFT',
        address: {
            56: '0x55d398326f99059fF775485246999027B3197955', //TODO usdt for test
            97: testnetOutput.PlatformToken, //TODO usdt for test
            1337: localOutput.PlatformToken,
        },
        decimals: 18,
    },
    FUSD: {
        symbol: 'FUSD',
        address: {
            56: '',
            97: testnetOutput.fusdToken,
            1337: localOutput.fusdToken,
        },
        decimals: 18,
    },
    lBTC: {
        symbol: 'lBTC',
        address: {
            56: '',
            97: testnetOutput.lbtcToken,
            1337: localOutput.lbtcToken,
        },
        decimals: 18,
    },
    'lBTC-202112': {
        symbol: 'lBTC-202112',
        address: {
            56: '',
            97: localOutput.lbtcToken202112,
            1337: localOutput.lbtcToken202112,
        },
        decimals: 18,
    },
    'USDC-IFT': {
        symbol: 'USDC-IFT',
        address: {
            56: '',
            97: '',
            1337: localOutput['USDC-IFT'],
        },
        decimals: 18,
    },
    'USDC-ETH': {
        symbol: 'USDC-ETH',
        address: {
            56: '',
            97: '',
            1337: localOutput['USDC-ETH'],
        },
        decimals: 18,
    },
};
