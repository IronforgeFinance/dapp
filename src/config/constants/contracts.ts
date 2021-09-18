/**
 * @description 在本地缓存设置innerLocalContracts/innerTestContracts来扩展或覆盖对应的合约配置
 */
import localContracts from '../../../contracts.local.json';
export const localOutput = {
    ...localContracts,
};
export const testnetOutput = {
    buildTokens: {
        platformToken: '0xc367998739358837CE991f6DE25658Cf43379cBa',
        usdcToken: '0x75b4a024ed0f4Da32140E59dd2d967b7e46533E7',
        btcToken: '0x60DBdFDeA0a6875F185b94D3A897D74555A19EDe',
        ethToken: '0x9F2a001e822F1A3F490da201786ca590ae8283C9',
        usdtToken: '0xD5A04fE881F2502f695ebb0553b9D4874Fb08CfB',
    },
    platformToken: '0xc367998739358837CE991f6DE25658Cf43379cBa',
    pancakeFactory: '0xbAEE1d8fDE1e9fb5829d2b9c4925D136DD16D85E',
    pancakeRouter: '0x68E07bf3459b1E35A9E36F8f117496d9aBa83164',
    'USDC-IFT': '0xB445E6C78D415FF5BE5bACc5D46853a92FbFaC7E',
    AssetSystem: '0x26C7f4865f5010f2DC4CeA9fe824ea57f95DD69c',
    BuildBurnSystem: '0x78708CB21146E2c5e74b1b9B085444370A2E5ECb',
    AccessControl: '0x5A661C61315CF6dca0D98d09aE5cdB5c0C0AeE07',
    DebtSystem: '0xd51344862c56C52E331150aaa819C06A414f6e46',
    lBTCUSD_210924: '0x15324CB786ebA543a2f4656238D2D5AF53340689',
    lBTCUSD_211231: '0xE0bc89424336D42784249540D39b2691C48Fb59a',
    lBTC: '0x595779a151eFC6487953fe878a4F0Aa1fE09b08c',
    lETH: '0xFd8f4C1ba50b2CD00A49811763EF4FE2b962D2a7',
    FUSD: '0x4E17662560ABf6D3FaBbCD538D921Ad20F48EcD4',
    CollateralSystem: '0x94eDDF973Afaf33F9689095a52ffF29Fd7F84508',
    ExchangeSystem: '0x79549182483Ec65a0652B5377351B40566ED1eA8',
    Prices: '0x96AAeF134C4B28F213ec9918da7b70dc679FfAc6',
    QuarterlyContractOracle: '0xca2466069F56211cA53e709cdeBCe7843071A9D6',
    platformTokenDexOracle: '0x85d01096Ff329021B7C3342430B0bbE7b7D55576',
    Config: '0x64Ca328Bb5D67C4235203C46c096187DCF1793E4',
    Liquidation: '0x396085f9d1Cff40495A5DD3F31f41882C802e951',
    quarterlyContracts: {
        lBTCUSD_210924: '0xFE483E8e927EA2ae1Eca9BA8981a508033712E4D',
        lBTCUSD_211231: '0x24C6412c49AD98F01FD40a7bFf2Ed8d2220163B3',
    },
    RewardSystem: '0x63930DB7f70FE18E2Ce1A158cc3A923a53710811',
    MinerReward: '0x9B65280Dc7d55B58F456c8D6f857AF5F73E74Fa3',
    LinearRelease: '0x0c32d86ED288cd37c3b21862d3385ba9ca1F9C40',
    Timelock: '0x9793f387ae8A0d60c1E1772C67a562d1c0537053',
    'USDC-ETH': '0xe6052EeAc24ed4cE0d838806c272c406d45eb8B2',
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
