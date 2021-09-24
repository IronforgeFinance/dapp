/**
 * @description 在本地缓存设置innerLocalContracts/innerTestContracts来扩展或覆盖对应的合约配置
 */

export const testnetOutput = {
    buildTokens: {
        platformToken: '0x69317C42F823453BC5712da530938059Dd8bC755',
        usdcToken: '0x6E76F4C945c9B26557cc426C38Aa071E0566aa8c',
        btcToken: '0x9d34Cd6530fCdC06c527FF5c4C2b83A8aF363180',
        ethToken: '0x18120071ea22B186b290cB6e5c5d97c17051B498',
        usdtToken: '0xfF4145a2492f3a5021eFB7f085504c8900Bf11f0',
    },
    platformToken: '0x69317C42F823453BC5712da530938059Dd8bC755',
    pancakeFactory: '0xda0055CF41653f645ff35afE71291943875BA2C2',
    pancakeRouter: '0x591460e006AcC4e4696800064D33797EA18062C2',
    'USDC-IFT': '0x153eed88e187372D121D2a698519A869f132693f',
    AssetSystem: '0x07FF6eA3E3e647f98091A23d9489cf8A3357C736',
    BuildBurnSystem: '0xB9d8ac7250b59645720EaE81a332A27B3C5b6383',
    AccessControl: '0x526b745bF0C05Ca724c2590063861500021D2328',
    DebtSystem: '0x0fCA87000eB8619cA2Ee6129D2Bb1406adB345E5',
    lBTCUSD_210924: '0xE404d7353AbCeD41419A4cB6842c1147dC1f9822',
    lBTCUSD_211231: '0xf056dE90EEC2EA68ca7B639e203028DE3B34366b',
    lBTC: '0xa25e35c44D30D208818a5C424b317233852AaC59',
    lETH: '0xF399EC91616C0a1Ee0B7C8611A4c21Ca34e3e16C',
    FUSD: '0x7083e7E756030F3bcDBc5ba6bAe09B2d1647c03b',
    CollateralSystem: '0x958752eF13Ca153F1D58b8E10be609E62A35a66D',
    ExchangeSystem: '0xd059EA745094c2556bDA8cDF559307521dD1B504',
    Prices: '0xB7BC91b38B014922Dee7E3dDEEAB228B33000D57',
    QuarterlyContractOracle: '0xA1Be2BEDE7E281f9e66EF4590bA28f598efDE406',
    platformTokenDexOracle: '0x4294C5c9fE03932117D934899bFBB96857AF316c',
    Config: '0x11081D385086d938266AD58e9Dd0f4b1566f5717',
    Liquidation: '0x401264F3dce137364Bfd57B238FF8a0b99225Cfe',
    quarterlyContracts: {
        lBTCUSD_210924: '0x64a156f980cE95d05647AAd1e814829e690a0862',
        lBTCUSD_211231: '0xFe70D8bd7C55f8bF0fC3378437D6BAF695542976',
    },
    RewardSystem: '0x3596F57443CE5Ec96040b203d9CD91F935A38F7D',
    MinerReward: '0xE8f453FcC03D929c674F191e53c20b5A8bdE9e2F',
    LinearRelease: '0xf3Cdca6Baf81C6e02a825a97167C96eCfE3675D6',
    Timelock: '0x69fE91C8250B1554eE58327710e9374ecDDC87d9',
    'USDC-ETH': '0x3457b7B7757c1bC8d7Dccd185eB45724A5cD799b',
};
export const localOutput = {
    ...testnetOutput,
    /**
     * @deprecated
     * @description 往localStorage里面的innerLocalContracts扩展合约信息
     */
    // ...localContracts,
    ...JSON.parse(localStorage.getItem('innerLocalContracts') ?? '{}'),
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
