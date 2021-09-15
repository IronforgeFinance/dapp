import './less/index.less';

import React, { useState, useMemo, useContext } from 'react';
import useEagerConnect from '@/hooks/useEagerConnect';
import Blacksmith from '@/assets/images/blacksmith.png';
import Merchant from '@/assets/images/merchant.png';
import { Link } from 'umi';
import { useInitialRatio } from '@/hooks/useConfig';
import { COLLATERAL_TOKENS } from '@/config';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import PreloadAssetsSuspense from '@/components/PreloadAssetsSuspense';
import TabGroup from '@/components/TabGroup';
import { ClaimRewardsContext } from '@/components/ClaimRewards';
import { useIntl } from 'umi';
import { Button } from 'antd';

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

export default () => {
    useEagerConnect();
    const isDev = () => {
        return process.env.NODE_ENV === 'development';
    };
    const intl = useIntl();
    const { open } = useContext(ClaimRewardsContext);
    const [tabKey, setTabKey] = useState(tabItems[0].key);
    const [showSelectFromToken, setShowSelectFromToken] = useState(false);
    const [collateralToken, setCollateralToken] = useState(
        COLLATERAL_TOKENS[0].name,
    );
    const initialRatio = useInitialRatio(collateralToken);

    const computedRatio = useMemo(
        () => initialRatio * 100,
        [collateralToken, initialRatio],
    );

    const { balance: fusdBalance } = useBep20Balance('FUSD');

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
                {/* <div className="sheepskin-box">
                    <div className="sheepskin-book mint">
                        <h3>{intl.formatMessage({ id: 'entry.mint' })}</h3>
                        <p className="summary">
                            {intl.formatMessage({ id: 'entry.mint.summary' })}
                        </p>
                        <p className="words">
                            {intl.formatMessage({ id: 'entry.mint.desc' })}{' '}
                            <Link to="/mint">
                                {intl.formatMessage({ id: 'entry.learnmore' })}
                            </Link>
                        </p>
                    </div>
                    <div className="sheepskin-book trade">
                        <h3>{intl.formatMessage({ id: 'entry.trade' })}</h3>
                        <p className="words">
                            {intl.formatMessage({ id: 'entry.trade.desc' })}{' '}
                            <Link to="/trade">
                                {intl.formatMessage({ id: 'entry.learnmore' })}
                            </Link>
                        </p>
                    </div>
                    <div className="sheepskin-book buy-ftoken">
                        <h3>{intl.formatMessage({ id: 'entry.buyToken' })}</h3>
                        <p className="words">
                            {intl.formatMessage({ id: 'entry.buyToken.desc' })}{' '}
                            <Link to="/farm">
                                {intl.formatMessage({ id: 'entry.learnmore' })}
                            </Link>
                        </p>
                    </div>
                </div> */}

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
                        <div className="pannel-content">4000 USD</div>
                    </div>
                    {/* <div className="pledge-ratio-box">
                        <SelectTokens
                            value={collateralToken}
                            tokenList={COLLATERAL_TOKENS}
                            onSelect={(v) => setCollateralToken(v)}
                        />
                        <span className="ratio">{computedRatio}%</span>
                        <p className="desc">
                            {intl.formatMessage({ id: 'data.pledgrate' })}
                        </p>
                    </div> */}
                    <div className="rewards-box">
                        <span className="amount">--</span>
                        <span className="label">Reward</span>
                        <Button
                            className="see-rewards-btn common-btn common-btn-red"
                            onClick={open}
                        >
                            Detail
                        </Button>
                    </div>
                    <div className="amount-box">
                        <span className="amount">{fusdBalance} fUSD</span>
                        <span className="desc">
                            {intl.formatMessage({ id: 'data.activedebt' })}
                        </span>
                    </div>
                </div>
            </div>
        </PreloadAssetsSuspense>
    );
};
