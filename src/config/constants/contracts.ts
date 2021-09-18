/**
 * @description 在本地缓存设置innerLocalContracts/innerTestContracts来扩展或覆盖对应的合约配置
 */
import localContracts from '../../../contracts.local.json';
export const localOutput = {
    ...localContracts,
};
export const testnetOutput = {
    "buildTokens": {
        "platformToken": "0x1e4307A832eDd35FD6be6Fd75E4f892230785Dfd",
        "usdcToken": "0x2b7ED86864d40644F14bd89D3DB43EaE09036538",
        "btcToken": "0x8229e25343132cFe45B272C63dB34c173348E395",
        "ethToken": "0x2f8e3141b926db06b9c2C1992D512012aa627cCE",
        "usdtToken": "0xB6f50B00B679B986D5c20f9Fe3acA3Ee7EE6f3c5"
    },
    "platformToken": "0x1e4307A832eDd35FD6be6Fd75E4f892230785Dfd",
    "pancakeFactory": "0x725d3ED816f8b2c791C1ceC9E2E0569c3f579dEA",
    "pancakeRouter": "0x86210974D6F3718751d205be57ABD503d350afFb",
    "USDC-IFT": "0xf8Ece1bFfe3C4dF8275e28f0051AA8Fdc16f4eDa",
    "AssetSystem": "0x31bdb67bf960eBaE48Cae8Db9b836b20494A64dB",
    "BuildBurnSystem": "0xf345Ad9D17722b029d4B06870f35A5758F51C9A1",
    "AccessControl": "0xdb537d8fbff069A3e50C4Ef602703590366FFF5A",
    "DebtSystem": "0xfef7E108C5C7bae8A93e4E44b3e51Bf04b361Bc9",
    "lBTCUSD_210924": "0x747958F0d1d4582057217B711028CF64788E6F0d",
    "lBTCUSD_211231": "0x59f3748D2Ca7FeFCEeEe6F628b3a1Ce59b106eB9",
    "lBTC": "0x8302A45a3cc2fCFe65E5143694c30322285b297f",
    "lETH": "0x77dF62Caf75fAd644C82602A878000a480a0EaE1",
    "FUSD": "0xF8Ef273d23F7457831E3e918b4f71a09753c9F55",
    "CollateralSystem": "0x46ae79d23960c8eE037b8BDb075EF09b41dF8eb0",
    "ExchangeSystem": "0x8F6F4184E35089DA119a333c175fE5EEfedF3417",
    "Prices": "0x5C85E346fb92dC593A7c876a0C0F132Ed28DA644",
    "QuarterlyContractOracle": "0xADbD87fFbF5cb44e6148Ff36fbbb8b435BaE55D5",
    "platformTokenDexOracle": "0x4b75E3C8f3fA9ee0BcEB7786154EBa1ce0453Adc",
    "Config": "0x680414CE09d9A6bBCBF1B5C21A778DfF1968544d",
    "Liquidation": "0x1F362a3Cb0e4E7F4Ec8dB39cB8FDd441ea5CB93F",
    "quarterlyContracts": {
        "lBTCUSD_210924": "0x3BfCbaA063Aa60b030DF41ce04aaA1032DbD9443",
        "lBTCUSD_211231": "0x5399cB27e48495Dbc049F6f4Afd273e17eB69522"
    },
    "RewardSystem": "0x9C1941b22C49Bd34c9C1d1422612303dB62230F5",
    "MinerReward": "0xEb6b22E2Ec1E8c00dC57c8A29719e3e571B1d5E4",
    "LinearRelease": "0x866264A09aB78698C7eB1CeC8e485E52C85C9623",
    "Timelock": "0xE38Ee60Cb41F34358D03e5872BB75a9D646B549E",
    "USDC-ETH": "0x79b567BC1dF3713672302dd2C3062a498e0E3367"
}
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
