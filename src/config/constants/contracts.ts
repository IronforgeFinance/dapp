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
        case '97': {
            mergedOutput = require('../../../contracts.test.json') ?? {};
            break;
        }
        case '56': {
            mergedOutput = require('../../../contracts.prod.json') ?? {};
            break;
        }
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
    PlatformToken: '0xa3f86034719B1BB5170f9C96b9BaE86eAAf416a3',
    pancakeFactory: '0x8CD195dd9744d01147b28FBC4bD50Fa6FA1676e2',
    pancakeRouter: '0xD9f4c527B889549c03765837d87C4D4B7CacDF83',
    usdcToken: '0xdC0233DB217F56525d6B0C777942f0F46a593299',
    'USDC-IFT': '0x0000000000000000000000000000000000000000',
    AssetSystem: '0x660f63668784810118eDd80f25DbB928ecdFa3aB',
    BuildBurnSystem: '0xbD1a8b5312C6BA4B5B3db2207C543ceD018613D8',
    Config: '0x77454Baab0F18E3DeF4Be4Ed8ADF9b0dC9595279',
    AccessControl: '0xC82aa413ada7fb4c232dC86F636d0B9cb5C4DdE3',
    Prices: '0x08115fad2dc5F4e432Bb89D73b822Ec4C7dbFe0F',
    DebtSystem: '0x04b45565E529c1446a889d5FBA12217e3f37D054',
    CollateralSystem: '0x2329f7CBB6017327C2cE66ff8dbA23b711c2F61d',
    ExchangeSystem: '0x5f38A8Bdd57150C0A456B8Fb9582456Ea73CfBff',
    Liquidation: '0xBAbEE967D254A15e47197F639962601e6FA0A3D8',
    fusdToken: '0xccA0516c6143c63C619602Df875F5829A5B31aD4',
    lbtcToken: '0x3FF4644dfDBbE922AD7b014f230Ddfba7728496B',
    btcToken: '0xBeCfcDF455647F3272515610d1d160D58B56c007',
    ethToken: '0x8Ec086904a9e7eDAb3B888c613D6Ca4badEac0B7',
    usdtToken: '0x86702905E8d5995649882fb3275aC7d3fef759a5',
    RewardSystem: '0xf04d8F9880A5BeeE47E82db0405F42Dc7fD31e55',
    ...mergedOutput,
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
        97: '',
        56: '',
        1337: localOutput.pancakeRouter,
    },
    PancakeFactory: {
        97: '',
        56: '',
        1337: localOutput.pancakeFactory,
    },
    MinerReward: {
        97: '',
        56: '',
        1337: localOutput.MinerReward,
    },

    //1337
    //     platformToken proxy deployed to: 0xB5a5cbB095e4eb3f64dF43A517363C94A95E39bA
    // AssetSystem proxy deployed to: 0xB296a2A9FB4A387E7C128b5DE9db18Bd21Ace6B4
    // BuildBurnSystem proxy deployed to: 0xf7A6092F167112D91e9d68b8351a52dE176B0aF3
    // Config proxy deployed to: 0x284c5Df2285b0B3aaAc7373A2aAb9696Bd673E33
    // AccessControl proxy deployed to: 0x8635DD1d19f3fD7186E96D5A0C6d9c374D09686F
    // Prices deployed to: 0x76A7AeeA53331bc354b60182912fA8dc7A864513
    // DebtSystem proxy deployed to: 0x41eD9771dd3745AF62eD963C08dfB23113942914
    // CollateralSystem proxy deployed to: 0xE5C06a2c0254Ed450Ee485FF63563ca0bAAF7598
    // ExchangeSystem proxy deployed to: 0x353DB1182C1C42A9dc6BF56eDBD18b9F246D270f
    // Liquidation proxy deployed to: 0xda52f8F4795D2Cf8376e140e978B90a04803F9b9
    // fusdToken proxy deployed to: 0x51866ba97CAa9496E2b0D6b3C1C2B2ed22264541
    // lbtcToken proxy deployed to: 0xf41bC45493e5351DF8DFB19dF46b4d02dEA4e5de
    // btcToken proxy deployed to: 0x236AE89e0D90D152342e8a71164e273B0cA6e97b

    // 97: {
    //     PlatformToken: '0x6702C65c26894a6213aFe6A05D6cc869F5f3A640',
    //     AssetSystem: '0xbd7C00d5341E3d5B3B633B342aBBC1B6DD973258',
    //     BuildBurnSystem: '0xa6d92C401A8c1b6dee1F1b97C4fc91be162037Cb',
    //     Config: '0x52B0FdCE2c92f8361308649c7F1752ed38EAd0C4',
    //     AccessControl: '0xB1660E901dABA5d5B2e1B0D9b8aC8798f1B491E5',
    //     Prices: '0xc62c9aCab4044D68e42Ea2Af4F38219C51feF0c5',
    //     DebtSystem: '0x19683bB92d1AFfe9d97BC688D01A8FD62736E106',
    //     CollateralSystem: '0xA80169DE808EbE29d4bF18BDADB09251b725a285',
    //     ExchangeSystem: '0xfc2531d45609e335BBF99Be32a2908972218513E',
    //     Liquidation: '0xCeFE2cACa6c45A1f6D5e9Dc9d07CAe958fd29a6e',
    //     fusdToken: '0x2A696b216a6262a15fA742750c49c463c9412307',
    //     lbtcToken: '0xD850Ce117c4620930FF8C2D80838c5688dfc9E11',
    //     btcToken: '0x59CF41A042728e8668f8d8e3bD48320D26D74b6A',
    //     RewardSystem: '0xE3137934A6Ed1a89ecA8c51A33DeAD8893A33768',
    // },
};
