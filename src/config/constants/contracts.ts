import { ChainIds } from '@/pages/Wallet/type';

/**
 * @description 合并自定义contracts配置
 * @property {Object} mergedOutput
 */

let mergedOutput;
try {
    switch (process.env.APP_CHAIN_ID as ChainIds) {
        case '1337': {
            mergedOutput = require('../../../contracts.local.json') ?? {};
            break;
        }
        // case '97': {
        //     mergedOutput = require('../../../contracts.test.json') ?? {};
        //     break;
        // }
        // case '56': {
        //     mergedOutput = require('../../../contracts.prod.json') ?? {};
        //     break;
        // }
    }
} catch (error) {
    console.warn(
        "⚠️ There's no mreged config of contracts. It will use default config.",
    );
}

export const localOutput = {
    ...mergedOutput,
};
export const testnetOutput = {
    buildTokens: {
        platformToken: '0xBd38e6B30206dcc02155e8303988588e46feec3f',
        usdcToken: '0x4abcaD271e0B5A2Ab9B9d0cD4d29732D9b91a56b',
        btcToken: '0xAf24Df7D020Da2F6153bB31f05Fd05Cd499d1EA9',
        ethToken: '0xa02c8b48d4C5c7AFc93e47d370C2f072AeA94be6',
        usdtToken: '0x6a7Ff2637F62deC78AC94EB9aABfb003C3d55636',
    },
    platformToken: '0xBd38e6B30206dcc02155e8303988588e46feec3f',
    pancakeFactory: '0xDa0A1aB4b2EF3b274741e2E2e622f57d6639E952',
    pancakeRouter: '0x82AB341ba8419C19B5a501FA5B33BfCE8612f83D',
    'USDC-IFT': '0x846aA8d47028fe4D7A246fDA2bf9779feF426bfa',
    AssetSystem: '0xCB45d30571BE90bF411837ffA7049f0037A03075',
    BuildBurnSystem: '0x1511a962c5d9A905505081218e75b5bfB78BFE08',
    AccessControl: '0xc73377267359B2665a603a0e4bBf7F95f042F405',
    DebtSystem: '0x53804680a256a9e507336Ceb0D01BE3696b87102',
    CollateralSystem: '0x4E3E7B4C8d6C68d01E576C0C98557E2F015f6E1D',
    ExchangeSystem: '0x20c32A03C24256b17CD4b6D37e19899156115c05',
    Prices: '0x1C6034955b7c2b494824d97a8d6ae868Acb5165C',
    QuarterlyContractOracle: '0x2d3eB6f1e0a16853aA1a1069E2c0809EB0e68D73',
    platformTokenDexOracle: '0x43Cc6d09dae81b1159D5A5FCbB154A96cB8d2288',
    Config: '0x6D2f557434375A62C54303d2d73670b530AdA23d',
    Liquidation: '0x11770AE80e3c748E2c47400612D2C85758f6aFcd',
    fusdToken: '0xF2F977040FEe0F11dBFA2b893C223C87cdF2F97b',
    lbtcToken: '0xc13A0D2D8ae2BCf6a7Ea971Aea623FEF95d3725b',
    quarterlyContracts: {
        BTCUSD_210924: '0x3F7443908C6b4Fb45ed0E581eAd87F630feBB864',
        BTCUSD_211231: '0x637dbAF095a6032Ccf4f3378639445133E8132c7',
    },
    RewardSystem: '0x4c07c1Bf9d5e2A8F43E9DC763116901C4A698288',
    MinerReward: '0xfD6e515734c2D4A81c37495ED13ca73bFFA796ec',
    LinearRelease: '0x2B7C66d658E8C023Bd66F96F09693D4C4F84C490',
    'USDC-ETH': '0x5Ed6E11CA01039E4AEA297D058251248E334C4b3',
};
export default {
    masterChef: {
        97: '0x1d32c2945C8FDCBc7156c553B7cEa4325a17f4f9',
        56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    },
    BuildBurnSystem: {
        97: testnetOutput.BuildBurnSystem,
        56: '',
        1337: localOutput.BuildBurnSystem,
    },
    CollateralSystem: {
        97: testnetOutput.CollateralSystem,
        56: '',
        1337: localOutput.CollateralSystem,
    },
    ExchangeSystem: {
        97: testnetOutput.ExchangeSystem,
        56: '',
        1337: localOutput.ExchangeSystem,
    },
    DebtSystem: {
        97: testnetOutput.DebtSystem,
        56: '',
        1337: localOutput.DebtSystem,
    },
    Config: {
        97: testnetOutput.Config,
        56: '',
        1337: localOutput.Config,
    },
    Liquidation: {
        97: testnetOutput.Liquidation,
        56: '',
        1337: localOutput.Liquidation,
    },
    Prices: {
        97: testnetOutput.Prices,
        56: '',
        1337: localOutput.Prices,
    },
    PancakeRouter: {
        97: testnetOutput.pancakeRouter,
        56: '',
        1337: localOutput.pancakeRouter,
    },
    PancakeFactory: {
        97: testnetOutput.pancakeFactory,
        56: '',
        1337: localOutput.pancakeFactory,
    },
    MinerReward: {
        97: testnetOutput.MinerReward,
        56: '',
        1337: localOutput.MinerReward,
    },
};
