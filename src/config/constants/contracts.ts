export const localOutput = {
    "PlatformToken": "0x22f5109bE6ae1bA8Ce1cB4e71AaCf25e1b157135",
    "pancakeFactory": "0xD814C585587571D1105e6615829F6b7698dd29F4",
    "pancakeRouter": "0x56Fc9F0c568723695287E81CAc1737bBb995f5A7",
    "usdcToken": "0x58Be049e772c2b512270face46575B1C19356699",
    "USDC-IFT": "0x07858c62a1636979ca325010fd3a677b1D68f5a0",
    "AssetSystem": "0x23b1d63dEaa18a9b7e574B1C48CEb3feaBf88044",
    "BuildBurnSystem": "0x238eC58A3911a1D890A9BD5827fb8C000096e527",
    "Config": "0x024e1381B52e636B71acc3eC586F9d0Aad778768",
    "AccessControl": "0xcd09e8B1D2687B77A4eb6A41FfaDfA9a12319AcB",
    "Prices": "0xD3379839A7b41F0a8F4280482B758773ceBe92E5",
    "DebtSystem": "0x0E27B8c8E73BCb91c131d77fEFE6b505B54Cf1c2",
    "CollateralSystem": "0xaEF2b224Aa27F4213FC296dB06db670bEb282055",
    "ExchangeSystem": "0xe98C64eA046E8D319b3c7D7c50b18D319F695bf2",
    "Liquidation": "0x18DCD9D25C259a37Ea5eec44E1B47A826162FDb7",
    "DexPriceHelper": "0xA48219ABb78BBfdac9FdC76cBBD2750fBE14b3F9",
    "fusdToken": "0xADD121FFB419FfF86899f8C07BaC38d3d43B23a7",
    "lbtcToken": "0x2A8213967dA4F9e6D48911E3F0C334951aE374aC",
    "lbtcToken202112": "0x94099529fA3276537409e3106812CF664eeCd7aA",
    "btcToken": "0xb0108C907dA6F4ca664F64f0a231a87C51d2489d",
    "ethToken": "0xF14cccf0C1957Ee8357448f4620AaD3BD70D3720",
    "usdtToken": "0xEB3DFe204E5987d684362ed26320dBc3CAd5c1Ca",
    "RewardSystem": "0x976dB2Ff68360AE34714896D6e02E59C92999180",
    "MinerReward": "0xA5C99fA34A48D3C057f44D453a330C125Ec1D330",
    "LinearRelease": "0xB5B21eE428C11844b2262938cb4dc2Cf3E27b39B",
    "USDC-ETH": "0x356754fe88475BC37A2288C6539B34789799FCaA"
}
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
