import React from 'react';
import './index.less';
import useEagerConnect from '@/hooks/useEagerConnect';

export default () => {
    useEagerConnect();
    return (
        <div className="home-container">
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
