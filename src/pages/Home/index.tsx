import React from 'react';
import './index.less';
import useEagerConnect from '@/hooks/useEagerConnect';

export default () => {
    useEagerConnect();
    const isDev = () => {
        return process.env.NODE_ENV === 'development';
    };
    return (
        <div className="home-container">
            <video loop autoPlay muted className="video-bg-left">
                <source
                    src={
                        isDev()
                            ? 'http://localhost:5000/files/blacksmith.webm'
                            : './static/blacksmith.webm'
                    }
                    type="video/webm"
                />
            </video>
            <video loop autoPlay muted className="video-bg-right">
                <source
                    src={
                        isDev()
                            ? 'http://localhost:5000/files/merchant.webm'
                            : './static/merchant.webm'
                    }
                    type="video/webm"
                />
            </video>
            <div className="sheepskin-book">
                <h3>Mint</h3>
                <p className="key">Mint fUSD by staking a Token</p>
                <p className="words">
                    Mint fUSD by staking your Token. Token stakers earn weekly
                    staking rewards in exchange for managing their
                    Collateralization Ratio and debt.{' '}
                    <a className="danger">Learn more</a>
                </p>
            </div>
            <div className="sheepskin-book">
                <h3>Trade</h3>
                <p className="key">Borrow other fAsset by using your fAsset</p>
                <p className="words">
                    Borrow other fAsset using your fAsset{' '}
                    <a className="danger">Learn more</a>
                </p>
            </div>
        </div>
    );
};
