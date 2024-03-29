import './pc.less';
import './mobile.less';

import { useState, useEffect, Fragment } from 'react';
import useEagerConnect from '@/hooks/useEagerConnect';
import Blacksmith from '@/assets/images/blacksmith.png';
import Merchant from '@/assets/images/merchant.png';
import { useInitialRatio } from '@/hooks/useConfig';
import { COLLATERAL_TOKENS, PLATFORM_TOKEN } from '@/config';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import TabGroup from '@/components/TabGroup';
import { useClaimRewards } from '@/components/ClaimRewards';
import { useIntl, useModel } from 'umi';
import { Button, Popover } from 'antd';
import { useWeb3React } from '@web3-react/core';
import { TokenIcon } from '@/components/Icon';
import { useCollateralSystem, useDebtSystem } from '@/hooks/useContract';
import { ethers } from 'ethers';
import { getTokenPrice } from '@/utils';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import useEnv from '@/hooks/useEnv';

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

    const tabItems = [
        {
            name: intl.formatMessage({ id: 'totalStaked' }),
            key: 'total-staked',
        },
        {
            name: intl.formatMessage({ id: 'collateral' }),
            key: 'collateral',
        },
    ];

    const { collateralTokens } = useModel('app', (model) => ({
        ...model,
    }));

    const { isMobile } = useEnv();
    const { open: openClaimRewards } = useClaimRewards();
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
        fetchStakePoolList([{ poolName: 'BST', poolId: POOL_ID }], account);
    }, [account]);

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
        <Fragment>
            {!isMobile && (
                <Fragment>
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
                </Fragment>
            )}

            {isMobile && (
                <section className="data-box">
                    <div className="rewards-card">
                        <span>
                            {account
                                ? stakeDataList[0]?.totalPendingReward + ' BST'
                                : '--'}
                        </span>
                        <h3>{intl.formatMessage({ id: 'rewards' })}</h3>
                    </div>
                    <br />
                    <div className="staked-card">
                        <h3>{intl.formatMessage({ id: 'totalStaked' })}</h3>
                        <span>{account ? `${totalStaked} FUSD` : '--'}</span>
                    </div>
                    <div className="collateral-card">
                        <h3>{intl.formatMessage({ id: 'collateral' })}</h3>
                        <div className="callterals">
                            {collaterals.map((item) => (
                                <Popover
                                    content={item.valueInUSD}
                                    trigger="hover"
                                    placement="topRight"
                                    key={item.token}
                                >
                                    <button>
                                        <TokenIcon name={item.token} />
                                    </button>
                                </Popover>
                            ))}
                        </div>
                    </div>
                    <div className="debt-card">
                        <span>{account ? `$${totalDebtInUSD}` : '--'}</span>
                        <h3>{intl.formatMessage({ id: 'activeDebt' })}</h3>
                    </div>
                </section>
            )}

            <section className="slogan-box">
                <p>
                    <b>Forging</b> the Future of
                    <br />
                    Crypto Finance.
                </p>
            </section>

            {isMobile && <img src={Blacksmith} className="blacksmith" />}

            {!isMobile && (
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
                                    {account ? `$${totalStaked}` : '--'}
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
                                ? stakeDataList[0]?.totalPendingReward + ' BST'
                                : '--'}
                        </span>
                        <span className="label">
                            {intl.formatMessage({ id: 'rewards' })}
                        </span>
                        <Button
                            className="see-rewards-btn common-btn common-btn-red"
                            onClick={openClaimRewards}
                        >
                            {intl.formatMessage({ id: 'detail' })}
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
            )}
        </Fragment>
    );
};
