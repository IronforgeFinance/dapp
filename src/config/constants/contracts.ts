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
    PlatformToken: '0x5cd474fEC769D3a5Fe9BAb2c5651D6D45F91dFe8',
    pancakeFactory: '0x2e58536d243E6ba5194FA8fAC978553a0dCf4d2D',
    pancakeRouter: '0x1Fd8e4d766161Ae9a611113ae0bE777525CA8D1c',
    usdcToken: '0xC0C837C0eAD64050850B249Cd2ec2e5787A5635f',
    'USDC-IFT': '0xe0a93aB85784555186EAB38E2C1d53aB407FE0F4',
    AssetSystem: '0x16365E250b30C36d6E92aaac8cC866539731c04F',
    BuildBurnSystem: '0x6f636436c65B1798861F279b6769d28B6ef50872',
    Config: '0xe7f6159A2B2a1D0eF4B77238A1A45A2aB659A9F5',
    AccessControl: '0x3BC86fad19e7Fed6EE36a0D224EA50277a40E4cC',
    Prices: '0x203338E9F735328c73D679e79254b59bc539c3F3',
    DebtSystem: '0x568B1192ae14f51FE3694Da9bEc240cB119F6E31',
    CollateralSystem: '0x181668B5f694ab3488DFe43a7E622a0772CFF245',
    ExchangeSystem: '0x2991072b30755f474d81B3F05d6a632b5fEd7BCe',
    Liquidation: '0x81590f5593f7DF70A40e0a1B98940318756A6f40',
    DexPriceHelper: '0x48Df29BCC2edA321544a0f87EacF0f0Acf62a90f',
    fusdToken: '0x970c4D173C7Ec5c719313DF7ccbD168C2De8B855',
    lbtcToken: '0x7D25ef82d92f508d5C24Ab52db9C1a76eD71252A',
    lbtcToken202112: '0x848d3E41333C7bE47FE42dd2b16F16406B9ad61d',
    btcToken: '0x2eA107747AE72D001D598F6558e80ea1f55EE6e6',
    ethToken: '0x22C1beC67bdc4F0702838e8E4F8aB147123c8f92',
    usdtToken: '0x631a8E2BaC1D7f64345C6fE9Dbe41E8F9c78BdC9',
    RewardSystem: '0x5808E6FF0fAFC23e710a03eaD0Ec5EE5A89d7f9f',
    MinerReward: '0x59358bCD31115D2352f57366246c8dA69AAa3370',
    LinearRelease: '0xd4a88A8b1F1705b7267B05D1A8c47F25DD7AD254',
    ...mergedOutput,
};
export const testnetOutput = {
    buildTokens: {
        platformToken: '0x142269a4B83AfC0F9D6F0A7D942B8b0FFFEE88E8',
        usdcToken: '0x35460Ba86Cc510700A9E5A48002099075A46dE8A',
        btcToken: '0xeEE2D2E8905Db17fe62926eb132859b1BFdaf9fd',
        ethToken: '0xaf5769F9fbd57d510D46E5f814c8Bf78E7aE091c',
        usdtToken: '0x421c773B4188397195B6C592955DECCE96409751',
    },
    platformToken: '0x142269a4B83AfC0F9D6F0A7D942B8b0FFFEE88E8',
    pancakeFactory: '0x06c05fa6E8AE58737081562e34D19E469Afe9c05',
    pancakeRouter: '0xf5D911A0234d66635FEa5e7AE021888b02b342A9',
    'USDC-IFT': '0xdf6313268B4668602FADaCdF81A2223e899066C7',
    AssetSystem: '0xAE7BED577d29B163Fdb8FDDFA0606AA5Bf7ce06A',
    BuildBurnSystem: '0xEE75b7a477448C22d9B2F46c553B25E05D4E9E24',
    AccessControl: '0xc273891D14E57A4966ED6b71341F8267286E4e2d',
    DebtSystem: '0x54951dA4E012d5D059043BdBDbDff63124E62940',
    CollateralSystem: '0x4095C1341171f7CccA6b7cBdB44e3b4aA326265e',
    ExchangeSystem: '0x0B9C4f5545fdE0941423214d937f721CA861606d',
    Prices: '0xD400644e5EA0c23459124eE2C0A740E896Da70a0',
    QuarterlyContractOracle: '0xAB12d871E55D95dB8694723b8c8ae33d1fA22c36',
    platformTokenDexOracle: '0xE7C0Afd549af521F9cba052e8BB397BDB168e9f1',
    Config: '0x028279793a83E58d5103bd92B0fb1E7f5E1a7eE8',
    Liquidation: '0x125C9d760e01068f86eeCF3FF4787d621c935303',
    fusdToken: '0x2A81B51028A241748642b9cC221642CA1548e357',
    lbtcToken: '0xCd60686354A3cf2Cc209c9c17D4aeA7de05C4386',
    quarterlyContracts: {
        BTCUSD_210924: '0xcEc60a89dA630349e8fe1082b15e00408e69AF5B',
        BTCUSD_211231: '0x0D28F21aC95538aD0F968C9c30C386b691Ff7beD',
    },
    RewardSystem: '0x0E9DFE4298074A248aa5c909f7540160FF6d159B',
    MinerReward: '0x1fD9a7022E3D306Af2EabF6d0e3426c317677Fe6',
    LinearRelease: '0x511ea1F6675aF27897931f79f53AA70d708186AE',
    'USDC-ETH': '0x068853b4411FF9499D101253C0787C64883d82D6',
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
