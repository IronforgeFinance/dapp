import React from 'react';
import './index.less';
import BigBoard from './BigBoard';

const tabItems = [
    {
        name: 'Holding',
        key: 'holding',
    },
    {
        name: 'Pool',
        key: 'pool',
    },
    {
        name: 'Farm',
        key: 'farm',
    },
    {
        name: 'History',
        key: 'history',
    },
];

const Holding = () => {
    return (
        <div className="holding-container">
            <div className="holding-total-value">
                <p className="wrapper">
                    <span className="label">Total Holding Value</span>
                    <span className="amount">6,392 fUSD</span>
                </p>
            </div>
            <div className="cols">
                <span className="col-name">Asset</span>
                <span className="col-name">Price</span>
                <span className="col-name">Balance</span>
                <span className="col-name">Rount</span>
                <span className="col-name">Ratio</span>
                <span className="col-name">Action</span>
            </div>
            <ul className="rows">
                {new Array(4).fill('').map((record, index) => {
                    return (
                        <li key={index} className="record">
                            <span className="asset data-normal">fUSD</span>
                            <span className="price data-normal bold">
                                $2100.00
                            </span>
                            <div className="balance data-token-balance">
                                <span className="amount">100</span>
                                <span className="map-dollar">$2100.00</span>
                            </div>
                            <div className="rount data-normal">Mint</div>
                            <span className="ratio data-normal">40%</span>
                            <div className="action">
                                <button className="common-btn common-btn-red">
                                    Trade
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const Pool = () => {
    return (
        <div className="pool-container">
            <div className="cols">
                <span className="col-name">Pool</span>
                <span className="col-name">Balance</span>
                <span className="col-name">Earned</span>
                <span className="col-name">APY</span>
                <span className="col-name">Action</span>
            </div>
            <ul className="rows">
                {new Array(4).fill('').map((record, index) => {
                    return (
                        <li key={index} className="record">
                            <div className="pool data-token-pair">
                                <i className="lp-tokenx" />
                                <span className="name">ETH+fUSD LP</span>
                            </div>
                            <div className="balance data-token-pair-balance">
                                <span className="token0">
                                    <b>0.03</b> ETH
                                </span>
                                <span className="token1">
                                    <b>0.05</b> fUSD
                                </span>
                            </div>
                            <div className="earned data-token-pair-balance">
                                <span className="token0">
                                    <b>0.03</b> ETH
                                </span>
                                <span className="token1">
                                    <b>0.05</b> fUSD
                                </span>
                            </div>
                            <span className="apy data-normal">40%</span>
                            <div className="action">
                                <button className="common-btn common-btn-red">
                                    Trade
                                </button>
                                <button className="common-btn common-btn-yellow">
                                    Withdraw
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const Farm = () => {
    return (
        <div className="farm-container">
            <div className="cols">
                <span className="col-name">Pool</span>
                <span className="col-name">Staked</span>
                <span className="col-name">Earned</span>
                <span className="col-name">APY</span>
                <span className="col-name">Action</span>
            </div>
            <ul className="rows">
                {new Array(4).fill('').map((record, index) => {
                    return (
                        <li key={index} className="record">
                            <div className="pool data-token-pair">
                                <i className="lp-tokenx" />
                                <span className="name">ETH+fUSD LP</span>
                            </div>
                            <div className="staked data-token-balance">
                                <span className="amount">100</span>
                                <span className="map-dollar">$2100.00</span>
                            </div>
                            <div className="earned data-token-pair-balance">
                                <span className="token0">
                                    <b>0.03</b> ETH
                                </span>
                                <span className="token1">
                                    <b>0.05</b> fUSD
                                </span>
                            </div>
                            <span className="apy data-normal">40%</span>
                            <div className="action">
                                <button className="common-btn common-btn-red">
                                    Provide
                                </button>
                                <button className="common-btn common-btn-yellow">
                                    Withdraw
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const History = () => {
    return (
        <div className="history-container">
            <ul className="rows">
                <li className="record">
                    <div className="function">
                        <i className="icon mint" />
                        <div className="info">
                            <span>Mint</span>
                            <time>10 Jun,2021 at 3:23 PM</time>
                        </div>
                    </div>
                    <div className="form">
                        From 20 <b>BNB</b>
                    </div>
                    <div className="to">
                        To <b>5</b> fUSD
                    </div>
                    <button className="skip" />
                </li>
                <li className="record">
                    <div className="function">
                        <i className="icon burn" />
                        <div className="info">
                            <span>Burn</span>
                            <time>10 Jun,2021 at 3:23 PM</time>
                        </div>
                    </div>
                    <div className="form">
                        From 20 <b>BNB</b>
                    </div>
                    <div className="to">
                        To <b>5</b> fUSD
                    </div>
                    <button className="skip" />
                </li>
                <li className="record">
                    <div className="function">
                        <i className="icon trade" />
                        <div className="info">
                            <span>Trade</span>
                            <time>10 Jun,2021 at 3:23 PM</time>
                        </div>
                    </div>
                    <div className="form">
                        From 20 <b>BNB</b>
                    </div>
                    <div className="to">
                        To <b>5</b> fUSD
                    </div>
                    <button className="skip" />
                </li>
                <li className="record">
                    <div className="function">
                        <i className="icon pool" />
                        <div className="info">
                            <span>Pool</span>
                            <time>10 Jun,2021 at 3:23 PM</time>
                        </div>
                    </div>
                    <div className="form">
                        From 20 <b>BNB</b>
                    </div>
                    <div className="to">
                        To <b>5</b> fUSD
                    </div>
                    <button className="skip" />
                </li>
            </ul>
        </div>
    );
};

export default () => {
    const [tabKey, setTabKey] = React.useState(tabItems[0].key);

    const CurrentView = React.useMemo(() => {
        switch (tabKey) {
            case 'holding': {
                return <Holding />;
            }
            case 'pool': {
                return <Pool />;
            }
            case 'farm': {
                return <Farm />;
            }
            case 'history': {
                return <History />;
            }
            default:
                return null;
        }
    }, [tabKey]);

    return (
        <div className="wallet">
            <BigBoard
                title="My Wallet"
                tabItems={tabItems}
                tabKey={tabKey}
                onChange={(key) => setTabKey(key)}
            >
                {CurrentView}
            </BigBoard>
        </div>
    );
};
