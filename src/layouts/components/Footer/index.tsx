import React from 'react';
import IconTwitter from '@/assets/images/twitter.svg';
import IconGithub from '@/assets/images/github.svg';
import IconMedium from '@/assets/images/medium.svg';
import { useFtokenPrice, useGetBnbBalance } from '@/hooks/useTokenBalance';
import DataBoard from './components/DataBoard';

const tabItems = [
    {
        name: 'Mint',
        key: 'mint',
    },
    {
        name: 'Burn',
        key: 'burn',
    },
    {
        name: 'Delivery',
        key: 'delivery',
    },
];

import './index.less';

const Mint = () => {
    return (
        <div className="mint-container">
            <div className="cols">
                <span className="col-name">Collateral</span>
                <span className="col-name">Locked</span>
                <span className="col-name">Minted</span>
                <span className="col-name">F-ratio</span>
                <span className="col-name type">Type</span>
                <span className="col-name">Date</span>
            </div>
            <ul className="rows">
                {new Array(4).fill('').map((record, index) => {
                    return (
                        <li key={index} className="record">
                            <div className="content-box">
                                <button className="btn-link" />
                                <div className="datas">
                                    <div className="head">
                                        <div className="collateral">
                                            <span
                                                className={`font-half-black token dot dot-${
                                                    index % 2 ? 'usdt' : 'usdc'
                                                }`}
                                            >
                                                <b className="font-bold-red">
                                                    10
                                                </b>
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: '&nbsp;',
                                                    }}
                                                />
                                                USDC
                                            </span>
                                            <span className="font-real-black dollar">
                                                $2000.00
                                            </span>
                                        </div>
                                        <span className="font-half-black locked">
                                            <b className="font-bold-red">0</b>{' '}
                                            fToken
                                        </span>
                                        <div className="minted">
                                            <span className="font-half-black icon usdc">
                                                <b className="font-bold-red">
                                                    10
                                                </b>{' '}
                                                USDC
                                            </span>
                                            <span className="font-real-black dollar">
                                                $2000.00
                                            </span>
                                        </div>
                                        <span className="font-real-black ratio">
                                            400%
                                        </span>
                                        <div className="type delivery font-half-black">
                                            <span className="label">
                                                Delivery
                                            </span>
                                            <p className="rest-days">
                                                <span>55days</span>
                                                <i className="tip" />
                                            </p>
                                        </div>
                                        <div className="date font-half-black">
                                            <span>10 Jun,2021</span>
                                            <span>at 3:23 PM</span>
                                        </div>
                                    </div>
                                    <div className="bottom">
                                        <div className="rate-wrapper">
                                            {new Array(2)
                                                .fill('')
                                                .map((item, index) => (
                                                    <p
                                                        key={index}
                                                        className={`token-rate dot dot-${
                                                            index % 2
                                                                ? 'usdt'
                                                                : 'usdc'
                                                        }`}
                                                    >
                                                        <span className="token font-half-black">
                                                            USDC
                                                        </span>
                                                        <span className="rate font-slight-black">
                                                            100%
                                                        </span>
                                                    </p>
                                                ))}
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-bar-wrapper">
                                                {new Array(2)
                                                    .fill('')
                                                    .map((item, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                width: `${
                                                                    (1 / 2) *
                                                                    100
                                                                }%`,
                                                            }}
                                                            className={`progress-move-bar bar-${
                                                                index % 2
                                                                    ? 'usdt'
                                                                    : 'usdc'
                                                            }`}
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default () => {
    const { price, rate } = useFtokenPrice();
    const { balance } = useGetBnbBalance();
    const [tabKey, setTabKey] = React.useState(tabItems[0].key);
    const [visable, setVisable] = React.useState(false);

    const CurrentView = React.useMemo(() => {
        switch (tabKey) {
            case tabItems[0].key: {
                return <Mint />;
            }
            case tabItems[1].key: {
                return <div></div>;
            }
            case tabItems[2].key: {
                return <div></div>;
            }
            default:
                return null;
        }
    }, [tabKey]);

    const openHistory = React.useCallback(() => {
        setVisable(true);
        setTabKey(tabItems[2].key);
    }, []);

    const openMint = React.useCallback(() => {
        setVisable(true);
        setTabKey(tabItems[0].key);
    }, []);

    return (
        <div className="footer-container">
            <div className="entries">
                <button className="btn-history" onClick={openMint} />
                <button className="btn-52days" onClick={openHistory} />
            </div>
            <div className="ftoken">
                <p className="price">
                    <span className="symbol">$</span>
                    {price}
                </p>
                <p className="label">
                    fToken Price <span className="rate">{rate}</span>
                </p>
            </div>
            <button className="btn-buy-token common-btn common-btn-red">
                Buy Token
            </button>
            {/* <p className="balance">Balance: {balance}</p> */}
            <div className="medias">
                <img key={1} src={IconTwitter} />
                <img key={2} src={IconGithub} />
                <img key={3} src={IconMedium} />
            </div>

            <DataBoard
                title={tabKey.replace(/^([\w]{1})/, (v) => v.toUpperCase())}
                tabItems={tabItems}
                tabKey={tabKey}
                onChange={(key) => setTabKey(key)}
                onClose={() => setVisable(false)}
                visable={visable}
            >
                {CurrentView}
            </DataBoard>
        </div>
    );
};
