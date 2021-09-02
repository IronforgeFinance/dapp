import React, { useState, useMemo } from 'react';
import './index.less';
import useEagerConnect from '@/hooks/useEagerConnect';
import Blacksmith from '@/assets/images/blacksmith.png';
import Merchant from '@/assets/images/merchant.png';
import { Link } from 'umi';
import { useInitialRatio } from '@/hooks/useConfig';
import { COLLATERAL_TOKENS } from '@/config';
import SelectTokens from '@/components/SelectTokens';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import PreloadAssetsSuspense from '@/components/PreloadAssetsSuspense';
import { useIntl } from 'umi';

export default () => {
    useEagerConnect();
    const isDev = () => {
        return process.env.NODE_ENV === 'development';
    };
    const intl = useIntl();
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
                <div className="sheepskin-box">
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
                </div>
                <div className="pledge-ratio-box">
                    <SelectTokens
                        value={collateralToken}
                        tokenList={COLLATERAL_TOKENS}
                        onSelect={(v) => setCollateralToken(v)}
                    />
                    <span className="ratio">{computedRatio}%</span>
                    <p className="desc">
                        {intl.formatMessage({ id: 'data.pledgrate' })}
                    </p>
                </div>
                <div className="amount-box">
                    <span className="amount">{fusdBalance} fUSD</span>
                    <span className="desc">
                        {intl.formatMessage({ id: 'data.activedebt' })}
                    </span>
                </div>
            </div>
        </PreloadAssetsSuspense>
    );
};
