/**
 * @description 在本地缓存设置innerLocalContracts/innerTestContracts来扩展或覆盖对应的合约配置
 */

export const testnetOutput = {
    safeDecimalMath: '0x476765f3a87a96D1c5564B0516Dc93e8740C6DaA',
    catalystMath: '0xbf10Eaf2C1976AfB99a7056Be12D81178405d2AF',
    buildTokens: {
        platformToken: '0x8FD06E016b130b8e2a517d9DC1FF10899508B14b',
        usdcToken: '0xFd9a847dD5e37e40DAa573a32fe43058f5018ad1',
        btcToken: '0x6a17E72bEfa58b883EE4BE22f05e946234930d3c',
        ethToken: '0xe1fbD1B9d9252dE65725847f0dca072d20e62B40',
        usdtToken: '0x13aCC9866559202638Ef1D99A190F37a6bC7D45d',
    },
    platformToken: '0x8FD06E016b130b8e2a517d9DC1FF10899508B14b',
    pancakeFactory: '0x317505041A8ac9eEd4d2D8037F0d432D989a06F8',
    pancakeRouter: '0x694CE6d875CaE2b468ee29CdFD969af501B43643',
    'USDC-IFT': '0xe35f1F3d7CF97738CC3F455692Fd7FF49AB18b07',
    AssetSystem: '0xaA44db6fC7767d000E810DC80210e2315A0e985a',
    BuildBurnSystem: '0x3115a57192d38805e98958F60704629812F65228',
    AccessControl: '0x74a780083e1D19A5e2AD419f3684Ee848b43b0d3',
    DebtSystem: '0x57cAB50aA94357214119805EeC6ed6D93Cc4e09A',
    Config: '0x9adA0945f952259643E09f68d391edB8bC21996B',
    synths: {
        lBTCUSD_210924: '0x8874221B93B23Dea19B8F06B1096ab227d37059A',
        lBTCUSD_211231: '0xe5B48055A09e4d101438fCC45De9869e9AB36dfB',
        lBTC: '0xcf784093fd37A253484AD6CE668Fe82699910D0b',
        lETH: '0x90e417260AE77bE5f7dc89d2426FA1a519576341',
        FUSD: '0x2fc88796eB66D6D26966945b65c7d624dE26CB0b',
    },
    CollateralSystem: '0xc356ae13A04bA51015c79F65b1757D2188cD7509',
    ExchangeSystem: '0xCc69216389ebBb2d842f060120F459A0F4EC5144',
    Prices: '0x67C6472B867068BCDAA9D4096875cf6Ef8ffF2AC',
    QuarterlyContractOracle: '0x76107f517ED946064DE23D056BFF622F8fC0ec63',
    platformTokenDexOracle: '0xd94F94E78e262fDaEd3b654B1EDea1d6EBf7545C',
    Liquidation: '0x44790E4360c750a99b4c4b8C3f1ae9dFe1726215',
    RewardSystem: '0x6F781A277B263575Ae8226a768cF68e3939f669E',
    MinerReward: '0x82A71A4C6EBf916Ba9f3eEfeD6D7f8d5aD419c15',
    LinearRelease: '0x949e9789dD504bc4B3f679aD87F8D12015d20B33',
    Timelock: '0x486810b7a1Ee6a0F9973a81f1cDd287e464cE574',
    'USDC-ETH': '0xECC1495C8640aA34cF2403135d382E5a4C468ECA',
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
    AssetSystem: {
        97: testnetOutput.AssetSystem,
        56: '',
        1337: localOutput.AssetSystem,
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
