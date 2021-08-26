import React, { useState, useMemo, Suspense } from 'react';
import './index.less';
import useEagerConnect from '@/hooks/useEagerConnect';
import Blacksmith from '@/assets/images/blacksmith.png';
import Merchant from '@/assets/images/merchant.png';
import { Link } from 'umi';
import { useInitialRatio } from '@/hooks/useConfig';
import { COLLATERAL_TOKENS } from '@/config';
import SelectTokens from '@/components/SelectTokens';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import PreloadImages from '@/components/PreloadImages';
import PreloadAssetsSuspense from '@/components/PreloadAssetsSuspense';

export default () => {
    useEagerConnect();
    const isDev = () => {
        return process.env.NODE_ENV === 'development';
    };
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
                        <h3>Mint</h3>
                        <p className="summary">Mint fUSD by staking a Token</p>
                        <p className="words">
                            Mint fUSD by staking your Token. Token stakers earn
                            weekly staking rewards in exchange for managing
                            their Collateralization Ratio and debt.{' '}
                            <Link to="/mint">Learn more</Link>
                        </p>
                    </div>
                    <div className="sheepskin-book trade">
                        <h3>Trade</h3>
                        <p className="words">
                            Earn rewards staking fToken. You will need a Binance
                            Chain wallet for the transaction.{' '}
                            <Link to="/trade">Learn more</Link>
                        </p>
                    </div>
                    <div className="sheepskin-book buy-ftoken">
                        <h3>Buy ftoken</h3>
                        <p className="words">
                            Earn rewards staking fToken. You will need a Binance
                            Chain wallet for the transaction.{' '}
                            <Link to="/farm">Learn more</Link>
                        </p>
                    </div>
                </div>
                <div className="pledge-ratio-box">
                    <SelectTokens
                        visable={showSelectFromToken}
                        value={collateralToken}
                        tokenList={COLLATERAL_TOKENS}
                        onSelect={(v) => setCollateralToken(v)}
                        onClose={() => setShowSelectFromToken(false)}
                    >
                        <button
                            className="btn-mint-form"
                            onClick={() => setShowSelectFromToken(true)}
                        >
                            <span>
                                {collateralToken || <span>Select token</span>}
                            </span>
                            <i className="icon-down size-20"></i>
                        </button>
                    </SelectTokens>
                    <span className="ratio">{computedRatio}%</span>
                    <p className="desc">My Current Pledge Ratio</p>
                </div>
                <div className="amount-box">
                    <span className="amount">{fusdBalance} fUSD</span>
                    <span className="desc">Active Debt</span>
                </div>
            </div>
        </PreloadAssetsSuspense>
    );
};
