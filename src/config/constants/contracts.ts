export const localOutput = {
    PlatformToken: '0xaF741336Ffd812967753b097Fd74520eA2e9671B',
    pancakeFactory: '0xEbf00276eD48Cb2d18de6acA739eB73A29a5dAa5',
    pancakeRouter: '0xd3B62B5F4437Ef8B8637e61BB05C205b208F4e1d',
    usdcToken: '0x555d4491adbCFE2D4E4c8B87401cb2305F75F565',
    AssetSystem: '0xD4cE243Ca9C086b6404a86c9D07Fec4f49fE81C1',
    BuildBurnSystem: '0xe8BFDC4E6720ae0f2eC3467D1Eb355c82fF12F5d',
    Config: '0x2dA35eF28Bae8ED458B5498E3B395588999D18E4',
    AccessControl: '0xCa162D88C73871c22A0455a161d30C678fee5580',
    Prices: '0xe2E3BD5cbc8eB470777BE0468a35785B4e430417',
    DebtSystem: '0x80DAcA9e19D64C6398884965F04F8F65FF47f83E',
    CollateralSystem: '0x43e5CC62CA53B54158e82a6075ea931fA2067F9C',
    ExchangeSystem: '0xBdaf20f132D3Cb0d018fE2FE3498a39DEE4AAD7C',
    Liquidation: '0x498f8604182EBa2eEc1126B4f36Ac9cB6772434F',
    fusdToken: '0xa301371BC2B879616a0aF12f0657B3099C55d629',
    lbtcToken: '0xb97d28cbb938a6B743e4E547B21666DF4538EE11',
    btcToken: '0xD72b7eB77179FA12d9830292E778E487548168db',
    ethToken: '0x1Bba5d8Af1860e1dBf1d0f61C7a10E695aEd2A4D',
    usdtToken: '0xE0CA62a09C19Bc83164972B8D7aeB4b3a0EF0905',
    RewardSystem: '0x17673fB69ACE4cDA5a78802b817B2058537EBD81',
};
const testnetOutput = {
    PlatformToken: '0x5d2489C5250662d79fCc549D939B7e7f8aA151FC',
    AssetSystem: '0x513e548c0A290bCe0475b35Bf7bE2f1625f7C6Fc',
    BuildBurnSystem: '0xcaF2f581047479e687D23F036bDAc2664eCAf6D3',
    Config: '0x2f274Eef6aE6E92C2f1082A2ec934aDD8e64634A',
    AccessControl: '0xa7B1864e0cDA24Ebc7a1A58fD7BDA94128fE95e1',
    Prices: '0x03C9d6F2F81c5eB83F3b7c0d4c5bEe219BE4332d',
    DebtSystem: '0x34Be2452e754c8836b2597397805d5F77aFEb1d1',
    CollateralSystem: '0x0d242a72498F475a15721C274d5d50B8831e13B3',
    ExchangeSystem: '0x5Deb059AF2564742acEa0CdBcdB3Ba86B07F48d9',
    Liquidation: '0xe9b1570e21531E25e5B685E6e18466608CB59Ea2',
    fusdToken: '0xCF1CcF2170b61320CD752Db95EE7e03867FDfA86',
    lbtcToken: '0xc7d3Ff160e3C552217C619eda0604f3398421C58',
    btcToken: '0x553f2cBcAc3C8FC18b842622fFa0dA21af184B77',
    RewardSystem: '0x9a1A0DFe71107a5d3eD18a2Cd6Bc542bedDAd273',
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
