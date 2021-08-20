export const localOutput = {
    PlatformToken: '0x77A7e28b0A2825D337D50AEA95E6b9A903B8Ca6E',
    pancakeFactory: '0x79c71F97E665F0cDAFfBAfa9e799a13F9455c024',
    pancakeRouter: '0xc684052D8DcBEFf83c83a62eb49a81f3B70e2b81',
    usdcToken: '0x26ECD1daf9117C65A15E6221985A9626aF121B4C',
    'USDC-IFT': '0x7dDaC7c614bcb19d8acC8c70cF056162ED7A73a8',
    AssetSystem: '0xdF4cE43832804743477dAf9cde5259fafeA83cfF',
    BuildBurnSystem: '0x703b0810Ca579F5B04f9dA05D22cbcaEae60cE80',
    Config: '0xaE21C7a6f4e04daadebf2aF81E41890f6Fe3e95E',
    AccessControl: '0x53631a8e04BF9E560aD63a180a1e865C7aC30359',
    Prices: '0x1b6332f9A5EA11cA5416e5A16cC36ef59ca27437',
    DebtSystem: '0xfC3fD2b91F8435623356F2442861C313950c63d8',
    CollateralSystem: '0x7E4EBdb5e7c94c6EEFE80f575A6FEe73Eb1938d7',
    ExchangeSystem: '0xA2C7450Ea0fdEd05F31027588bAF5DB3ef242461',
    Liquidation: '0x60Bd077D7240835295f0a48Da8BAD0cB23bE27EA',
    DexPriceHelper: '0x7c4C2c44b21bE1B3CA1303F06798317b493Eb9F9',
    fusdToken: '0x5Fb4f2B50c8c71B8D8f188CE161B16A44593c236',
    lbtcToken: '0xa6855c821CdBFD6b1b513E22639aAC6631e70095',
    lbtcToken202112: '0xb7A22025AC60126E2f5754C6a44625fEF5c6cB06',
    btcToken: '0xd1F7E9Cc7073a5166f69dEbb17290e9dceB3d434',
    ethToken: '0xcC11f59a99e990233A65Fa626D4AbE0d3C2B29C8',
    usdtToken: '0x8579F9e638B771F3D3Df5Ed644b5754c12517DeC',
    RewardSystem: '0x5CAb72Fe1F5da2955cBdc77fB785F549a116659C',
    MinerReward: '0x89cd87BAaDc7F056eE44c3b4D20822441DDD2Eb5',
    LinearRelease: '0xC66Ff809409DbD69ACeeD04f002b345a8851705f',
    'USDC-ETH': '0xb0a49Aa8b1aFae8C07Ee5a3ADFE6637467EE4058',
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
