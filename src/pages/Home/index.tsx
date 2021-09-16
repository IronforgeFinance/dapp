import './less/index.less';

import React, {
    useState,
    useEffect,
    useMemo,
    useContext,
    Fragment,
} from 'react';
import useEagerConnect from '@/hooks/useEagerConnect';
import Blacksmith from '@/assets/images/blacksmith.png';
import Merchant from '@/assets/images/merchant.png';
import { Link } from 'umi';
import { useInitialRatio } from '@/hooks/useConfig';
import { COLLATERAL_TOKENS, PLATFORM_TOKEN } from '@/config';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import PreloadAssetsSuspense from '@/components/PreloadAssetsSuspense';
import TabGroup from '@/components/TabGroup';
import { ClaimRewardsContext } from '@/components/ClaimRewards';
import { useIntl, useModel } from 'umi';
import { Button, Popover } from 'antd';
import { useWeb3React } from '@web3-react/core';
import { TokenIcon } from '@/components/Icon';
import { useCollateralSystem, useDebtSystem } from '@/hooks/useContract';
import { ethers } from 'ethers';
import { getTokenPrice } from '@/utils';
import { toFixedWithoutRound } from '@/utils/bigNumber';

const tabItems = [
    {
        name: 'Total Staked',
        key: 'total-staked',
    },
    {
        name: 'Collateral',
        key: 'collateral',
    },
];
const POOL_ID = 0;

const mockCollaterals = ['BTC'];

interface ICollateralData {
    token: string;
    amount: number;
    valueInUSD: number;
}

export default () => {
    useEagerConnect();
    const isDev = () => {
        return process.env.NODE_ENV === 'development';
    };
    const intl = useIntl();
    const { open } = useContext(ClaimRewardsContext);
    const [tabKey, setTabKey] = useState(tabItems[0].key);
    const [showSelectFromToken, setShowSelectFromToken] = useState(false);
    const { account } = useWeb3React();
    const [collateralToken, setCollateralToken] = useState(
        COLLATERAL_TOKENS[0].name,
    );
    const [collaterals, setCollaterals] = useState<ICollateralData[]>([]);
    const [totalStaked, setTotalStaked] = useState(0);
    const [totalDebtInUSD, setTotalDebtInUSD] = useState(0);

    const initialRatio = useInitialRatio(collateralToken);
    const collateralSystem = useCollateralSystem();
    const debtSystem = useDebtSystem();

    const { fetchStakePoolList, stakeDataList } = useModel(
        'stakeData',
        (model) => {
            return { ...model };
        },
    );

    useEffect(() => {
        fetchStakePoolList([{ poolName: 'BS', poolId: POOL_ID }], account);
    }, [account]);

    const computedRatio = useMemo(
        () => initialRatio * 100,
        [collateralToken, initialRatio],
    );

    const { balance: fusdBalance } = useBep20Balance('FUSD');

    const { debtData } = useModel('dataView', (model) => ({
        debtData: model.stakedData,
    }));
    const getCollateralDataByToken = async (
        token: string,
        account?: string,
    ) => {
        if (!account) {
            return {
                token,
                amount: 0,
                valueInUSD: 0,
            };
        }
        const res = await collateralSystem.getUserCollateral(
            account,
            ethers.utils.formatBytes32String(token),
        );
        const data = parseFloat(ethers.utils.formatUnits(res, 18));
        const price = await getTokenPrice(token);
        const collateralInUSD = data * price;
        console.log('getCollateralData: ', token, data);
        const lockRes = await collateralSystem.userLockedData(
            account,
            ethers.utils.formatBytes32String(token),
        );
        const lockData = parseFloat(ethers.utils.formatEther(lockRes));
        const lockedPrice = await getTokenPrice(PLATFORM_TOKEN);
        const valueInUSD = lockedPrice * lockData + collateralInUSD;
        return {
            token,
            amount: data,
            valueInUSD,
        };
    };
    const fetchCollateralInfo = async () => {
        const tokens = COLLATERAL_TOKENS.map((token) => token.name);
        const infos = await Promise.all(
            tokens.map((token) => getCollateralDataByToken(token, account)),
        );
        const total = infos.reduce((total, item) => {
            return (total += item.valueInUSD);
        }, 0);
        setCollaterals(infos);
        setTotalStaked(total);
    };

    const getDebtInUSD = async () => {
        if (!account) {
            return 0;
        }
        const res = await Promise.all(
            COLLATERAL_TOKENS.map((token) =>
                debtSystem.GetUserDebtBalanceInUsd(
                    account,
                    ethers.utils.formatBytes32String(token.name),
                ),
            ),
        );

        const totalDebtInUsd = res.reduce((total, item) => {
            const val = parseFloat(ethers.utils.formatUnits(item[0], 18));
            total += val;
            return total;
        }, 0);
        const val = toFixedWithoutRound(totalDebtInUsd, 2);
        setTotalDebtInUSD(val);
    };

    useEffect(() => {
        fetchCollateralInfo();
        getDebtInUSD();
    }, [account]);

    return (
        <PreloadAssetsSuspense>
            {/* <PreloadImages
                imageList={[
                    'http://zoneccc.nat300.top/static/blacksmith.0d9279a9.png',
                ]}
            /> */}
            <div className="home-container">
                <video
                    loop
                    autoPlay
                    muted
                    className="video-bg-left"
                    poster={Blacksmith}
                >
                    <source
                        src={
                            isDev()
                                ? 'http://localhost:5000/files/blacksmith.webm'
                                : './static/blacksmith.webm'
                        }
                        type="video/webm"
                    />
                </video>
                <video
                    loop
                    autoPlay
                    muted
                    className="video-bg-right"
                    poster={Merchant}
                >
                    <source
                        src={
                            isDev()
                                ? 'http://localhost:5000/files/merchant.webm'
                                : './static/merchant.webm'
                        }
                        type="video/webm"
                    />
                </video>

                <section className="slogan-box">
                    <p>
                        <b>Forging</b> the Future of Crypto Finance.
                    </p>
                </section>
                <div className="data-box">
                    <div className="staked-and-collateral-box">
                        <TabGroup
                            items={tabItems}
                            value={tabKey}
                            onChange={(v) => setTabKey(v)}
                            className="custom-tabs-group"
                        />

                        <div className="pannel-content">
                            {tabKey === 'total-staked' && (
                                <Fragment>
                                    {account ? `${totalStaked} FUSD` : '--'}
                                </Fragment>
                            )}
                            {tabKey === 'collateral' && (
                                <div className="callterals">
                                    {collaterals.map((item) => (
                                        <Popover
                                            content={item.valueInUSD}
                                            trigger="hover"
                                            placement="topRight"
                                            key={item.token}
                                        >
                                            <button>
                                                <TokenIcon
                                                    name={item.token}
                                                    size={36}
                                                />
                                            </button>
                                        </Popover>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="rewards-box">
                        <span className="amount">
                            {account
                                ? stakeDataList[0].totalPendingReward + ' BS'
                                : '--'}
                        </span>
                        <span className="label">Rewards</span>
                        <Button
                            className="see-rewards-btn common-btn common-btn-red"
                            onClick={open}
                        >
                            Detail
                        </Button>
                    </div>
                    <div className="amount-box">
                        <span className="amount">
                            {account ? `$${totalDebtInUSD}` : '--'}
                        </span>
                        <span className="desc">
                            {intl.formatMessage({ id: 'data.activedebt' })}
                        </span>
                    </div>
                </div>
            </div>
        </PreloadAssetsSuspense>
    );
};
