/**
 * @description 在本地缓存设置innerLocalContracts/innerTestContracts来扩展或覆盖对应的合约配置
 */

export const testnetOutput = {
    safeDecimalMath: '0x6364eb5243ED88fC7BffDAC22D8921d3838Ed037',
    catalystMath: '0xae0601De76dF9f391fa1bB5cb98eaf3B0D27C535',
    buildTokens: {
        platformToken: '0xfCB08D72D28EB8b8656799f1193465995443F0B8',
        usdcToken: '0x7b196f73dF8b4D18Bd81652f1e0C49C17024cfA3',
        btcToken: '0x2409dDbF11B64b8EA40a64f58e6D42Ee04B8E34e',
        ethToken: '0x0eF0E57FE164bd2beE06Cc524370C2EFB942EB70',
        usdtToken: '0xdF5f9959baE6e7354325C72FAB215974f4ca836e',
    },
    platformToken: '0xfCB08D72D28EB8b8656799f1193465995443F0B8',
    pancakeFactory: '0xF1a901B01205A529E7bca161F905618ab07303e8',
    pancakeRouter: '0x37AF26d23488b5dC9c70ca621109C96DEDbCA2Ac',
    'USDC-IFT': '0xea606FeC7b2CA173AC362c7f5911AA3DcaC2C700',
    AssetSystem: '0x2EfADc073B73d725E825Cad299eCf1C4b51FB347',
    BuildBurnSystem: '0x94A88414c419257A5CA4f03884A2416600E852e3',
    AccessControl: '0x3b2152e696a28739AB9139E65855D7422304B0F5',
    DebtSystem: '0x0C0eAA77aAdee78759d14eD9EAE1ad6D60A85775',
    Config: '0x28AD5a9fADE37007A7Da4F241Da694C2AaA6D6dA',
    synths: {
        lBTCUSD_210924: '0xfE9197ff43eFc1706e5E50F61fd72eff901c869e',
        lBTCUSD_211231: '0x44278696EA011FCD1667CD85E0F153858C66553C',
        lBTC: '0x50B584A253cb65c04DaD1B195c8CA253eAb6588A',
        lETH: '0xdf95Df659A2933f8B4F369212D52AefB3fDc31Cc',
        FUSD: '0xEB0BF635fc5F87D35705E358cD0f67F97a4dbB2b',
    },
    CollateralSystem: '0x85e5cbC150fa276CDC10fc0431fb4b33E9F12876',
    ExchangeSystem: '0x7e469E9Dd3DD8Dce4B95C204887D62882f9d7369',
    Prices: '0x1F2456CBFb5Fd1746C3E4c5Db56eE67F4E8d3Bb9',
    QuarterlyContractOracle: '0x698F1B0a2E7eb1FCc19b015bCEB9A563DD9D1f2F',
    platformTokenDexOracle: '0xBE5b031D5f020053dF58431d6F9A6f9f44C1f741',
    Liquidation: '0xf7D122ffF7aBD918d2a037E617457537c0fbd590',
    RewardSystem: '0xB6d1EC2ed471f9B1B65cE8Bb9a43F67dE253F498',
    MinerReward: '0xb57fe6409c08e9246E9E61638F953253B7225212',
    LinearRelease: '0xA3bBB36539A31B96b8832875684A8c5155d7C2b9',
    Timelock: '0xe99e60f506a650032FB01dBF170eda5303FcB469',
    'USDC-ETH': '0x27ec74d0bb01b49B4a3A2A130F35485Bb0863a0e',
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
