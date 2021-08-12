import React from 'react';
import './index.less';
import { Select } from 'antd';
import useEagerConnect from '@/hooks/useEagerConnect';
import Blacksmith from '@/assets/images/blacksmith.png';
import Merchant from '@/assets/images/merchant.png';
export default () => {
    useEagerConnect();
    const isDev = () => {
        return process.env.NODE_ENV === 'development';
    };
    return (
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
                            ? 'http://localhost:5000/files/blacksmith2.webm'
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
                        weekly staking rewards in exchange for managing their
                        Collateralization Ratio and debt.{' '}
                        <a href="/mint">Learn more</a>
                    </p>
                </div>
                <div className="sheepskin-book trade">
                    <h3>Trade</h3>
                    <p className="words">
                        Earn rewards staking fToken. You will need a Binance
                        Chain wallet for the transaction.{' '}
                        <a href="/trade">Learn more</a>
                    </p>
                </div>
                <div className="sheepskin-book buy-ftoken">
                    <h3>Buy ftoken</h3>
                    <p className="words">
                        Earn rewards staking fToken. You will need a Binance
                        Chain wallet for the transaction.{' '}
                        <a href="/farm">Learn more</a>
                    </p>
                </div>
            </div>
            <div className="pledge-ratio-box">
                <Select className="common-select" placeholder={'Select token'}>
                    {['USDC'].map((item) => (
                        <Select.Option value={item} key={item}>
                            {item}
                        </Select.Option>
                    ))}
                </Select>
                <span className="ratio">400%</span>
                <p className="desc">My Current Pledge Ratio</p>
            </div>
            <div className="amount-box">
                <span className="amount">130030 fUSD</span>
                <span className="desc">Active Debt</span>
            </div>
        </div>
    );
};
