import { localOutput, testnetOutput } from './contracts';

export default {
    USDT: {
        symbol: 'USDT',
        address: {
            56: '0x55d398326f99059fF775485246999027B3197955',
            97: testnetOutput.buildTokens.usdtToken,
            1337: localOutput.buildTokens.usdtToken,
        },
        decimals: 18,
        projectLink: 'https://tether.to/',
    },
    USDC: {
        symbol: 'USDC',
        address: {
            56: '',
            97: testnetOutput.buildTokens.usdcToken,
            1337: localOutput.buildTokens.usdcToken,
        },
        decimals: 18,
        projectLink: 'https://tether.to/',
    },
    BTC: {
        symbol: 'BTCB',
        address: {
            56: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
            97: testnetOutput.buildTokens.btcToken,
            1337: localOutput.buildTokens.btcToken,
        },
        decimals: 18,
        projectLink: 'https://bitcoin.org/',
    },
    ETH: {
        symbol: 'ETH',
        address: {
            56: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
            97: testnetOutput.buildTokens.ethToken,
            1337: localOutput.buildTokens.ethToken,
        },
        decimals: 18,
        projectLink: 'https://ethereum.org/en/',
    },
    BST: {
        symbol: 'BST',
        address: {
            56: '0x55d398326f99059fF775485246999027B3197955', //TODO usdt for test
            97: testnetOutput.buildTokens.platformToken, //TODO usdt for test
            1337: localOutput.buildTokens.platformToken,
        },
        decimals: 18,
    },
    BS: {
        symbol: 'BST',
        address: {
            56: '0x55d398326f99059fF775485246999027B3197955', //TODO usdt for test
            97: testnetOutput.buildTokens.platformToken, //TODO usdt for test
            1337: localOutput.buildTokens.platformToken,
        },
        decimals: 18,
    },
    FUSD: {
        symbol: 'FUSD',
        address: {
            56: '',
            97: testnetOutput.synths.FUSD,
            1337: localOutput.synths.FUSD,
        },
        decimals: 18,
    },
    lBTC: {
        symbol: 'lBTC',
        address: {
            56: '',
            97: testnetOutput.synths.lBTC,
            1337: localOutput.synths.lBTC,
        },
        decimals: 18,
    },
    lETH: {
        symbol: 'lETH',
        address: {
            56: '',
            97: testnetOutput.synths.lETH,
            1337: localOutput.synths.lETH,
        },
        decimals: 18,
    },
    'USDC-BST': {
        symbol: 'USDC-BST',
        address: {
            56: '',
            97: testnetOutput['USDC-BST'],
            1337: localOutput['USDC-BST'],
        },
        decimals: 18,
    },
    'USDC-ETH': {
        symbol: 'USDC-ETH',
        address: {
            56: '',
            97: testnetOutput['USDC-ETH'],
            1337: localOutput['USDC-ETH'],
        },
        decimals: 18,
    },
    lBTCUSD_210924: {
        symbol: 'lBTCUSD_210924',
        address: {
            56: '',
            97: testnetOutput.synths.lBTCUSD_210924,
            1337: localOutput.synths.lBTCUSD_210924,
        },
        decimals: 18,
    },
    lBTCUSD_211231: {
        symbol: 'lBTCUSD_211231',
        address: {
            56: '',
            97: testnetOutput.synths.lBTCUSD_211231,
            1337: localOutput.synths.lBTCUSD_211231,
        },
        decimals: 18,
    },
};
