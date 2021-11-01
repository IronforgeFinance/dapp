/**
 * @description 在本地缓存设置innerLocalContracts/innerTestContracts来扩展或覆盖对应的合约配置
 */

export const testnetOutput = {
    safeDecimalMath: '0x4C7C6981185B2eEE5f243FAc0AA415cc0328643e',
    catalystMath: '0x15E0c353607BC2948ec93bC919B615f5466FAA57',
    buildTokens: {
        platformToken: '0x892d56Db9AEAB59B8DAd09900953F3d99aE119a0',
        usdcToken: '0xFd9a847dD5e37e40DAa573a32fe43058f5018ad1',
        btcToken: '0x6a17E72bEfa58b883EE4BE22f05e946234930d3c',
        ethToken: '0xe1fbD1B9d9252dE65725847f0dca072d20e62B40',
        usdtToken: '0x13aCC9866559202638Ef1D99A190F37a6bC7D45d',
    },
    platformToken: '0x892d56Db9AEAB59B8DAd09900953F3d99aE119a0',
    pancakeFactory: '0x317505041A8ac9eEd4d2D8037F0d432D989a06F8',
    pancakeRouter: '0x694CE6d875CaE2b468ee29CdFD969af501B43643',
    'USDC-BST': '0x51b53A9968eE7E7281c0937eF7E422AD4FaDCd5E',
    assetSystem: '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1',
    publicCatalystMath: '0xDAeCeFBAf8aa89AFF9B6d321695AaeA7a1014747',
    BuildBurnSystem: '0x564723B3b97ca0Bc8963B42FCF42C4Ef71C56Da1',
    AccessControl: '0x2112be39aF91c21fef8053A7D41977808aeaEd9C',
    DebtSystem: '0xacA4684C0a400a1577e02224091f706FC0B5d7b9',
    Config: '0x15118d583174e8691e33391E54d8F6D474b8e044',
    ExchangeSystem: '0xDD8f7473CDE4Ef27C030a5aB744c282fE9164474',
    Timelock: '0x819b54274f1FdC62d652ae288E925daBEC54E6D7',
    synths: {
        lBTCUSD_210924: '0x2334b60df5fb07be0CF4E958E8aE4455592bc1b1',
        lBTCUSD_211231: '0x68c280169f98f84E018EE00B7F4ac8b7CA48198d',
        lBTC: '0xdc158055C29adaa67b9b11a2aefC6B9663C5A5f5',
        lETH: '0x06C1dcEf631A1f71271e9033bd8627Baf473b280',
        FUSD: '0x70c97976b41C035A019F34e47a041d155f550063',
    },
    CollateralSystem: '0x290270A1141D3836EF6c04eab4EbF2c0F12bD033',
    QuarterlyContractOracle: '0x57C40520E2585c1d25D3Fe2aa699cb4f4Aa6c2fc',
    Prices: '0xC397707d89e6708960f54659601867A428161B91',
    platformTokenDexOracle: '0x4de62E7DbDbEE5F9cDd4d23FF904C380D79aEf2B',
    RewardSystem: '0x5570720CcDfA7a8537F54044F0dAf77358439419',
    MinerReward: '0x2e6adF5fa246D2F35f4d54a249d8595ADCD2accd',
    LinearRelease: '0xE14CfDF62144B700883e1696654F172415fF39A3',
    Liquidation: '0x1A7f18f81cd25aB82A047A42Cf8515Be2FA40e14',
    AssetSystem: '0xC03c37077AebFa6608b1D22384D7786C210F03C2',
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
