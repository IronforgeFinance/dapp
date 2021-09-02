import React, { useState, useEffect } from 'react';
import './index.less';
import { FiatSymbol } from '@/config/constants/types';
import classNames from 'classnames';
import { copyTextToClipboard } from '@/utils/clipboard';
import Notification from '@iron/Notification';
import Folder from '@iron/Folder';
import { ourClient } from '@/subgraph/clientManager';
import { GET_TRADE_MARKET_DETAIL } from '@/subgraph/graphql';
// type DataType = 'address' | 'mouney';
import { ethers } from 'ethers';
import { useERC20, usePrices } from '@/hooks/useContract';
import Tokens from '@/config/constants/tokens';
import Contracts from '@/config/constants/contracts';
import { useIntl } from 'umi';

interface Price {
    amount: string | number;
    symbol?: FiatSymbol;
}

interface Address {
    address: string;
}

interface DetailData<T> {
    label: string;
    value: T;
}

function instanceOfAddress(object: any): object is Address {
    return 'address' in object;
}

function instanceOfPrice(object: any): object is Price {
    return 'amount' in object;
}

interface MarketDetailProps {
    token0: string;
    token1: string;
}

interface IMarketTokenData {
    token: string;
    tradeVolumeUSD: number;
    marketCap: number;
    priceHigh: number;
    priceLow: number;
    priceFeedContract: string;
    contract: string;
}

const DEFAULT_TOKEN_DATA = {
    id: '',
    token: '',
    tradeVolumeUSD: 0,
    marketCap: 0,
    priceHigh: 0,
    priceLow: 0,
    priceFeedContract: '',
    contract: '',
};

const MarketDetail = (props: MarketDetailProps) => {
    const intl = useIntl();
    const { token0, token1 } = props;
    const [data0, setData0] = useState<IMarketTokenData>(DEFAULT_TOKEN_DATA);
    const [data1, setData1] = useState<IMarketTokenData>(DEFAULT_TOKEN_DATA);

    const token0Contract = useERC20(
        Tokens[token0].address[process.env.APP_CHAIN_ID],
    );
    const token1Contract = useERC20(
        Tokens[token1].address[process.env.APP_CHAIN_ID],
    );
    const prices = usePrices();

    const getTokenPrice = async (token: string) => {
        if (!token) return 0;
        const res = await prices.getPrice(
            ethers.utils.formatBytes32String(token),
        );
        return parseFloat(ethers.utils.formatEther(res));
    };
    const fetchData = async (token, index) => {
        const dataRes = await ourClient.query({
            query: GET_TRADE_MARKET_DETAIL,
            variables: {
                token: token,
            },
        });
        const data = { ...dataRes.data.tokenDayDatas[0] };
        if (!data.id) {
            return { ...DEFAULT_TOKEN_DATA, token };
        }
        data.priceHigh = ethers.utils.formatEther(data.priceHigh);
        data.priceLow = ethers.utils.formatEther(data.priceLow);
        data.tradeVolumeUSD = ethers.utils.formatEther(data.tradeVolumeUSD);
        const tokenContract = index === 0 ? token0Contract : token1Contract;
        const totalSupply = parseFloat(
            ethers.utils.formatEther(await tokenContract.totalSupply()),
        );
        const price = await getTokenPrice(token);
        const marketCap = parseFloat((totalSupply * price).toFixed(2));
        data.marketCap = marketCap;
        data.priceFeedContract = Contracts.Prices[process.env.APP_CHAIN_ID];
        data.contract = Tokens[token].address[process.env.APP_CHAIN_ID];
        return data;
    };

    useEffect(() => {
        (async () => {
            const data = await fetchData(token0, 0);
            setData0(data);
        })();
    }, [token0]);

    useEffect(() => {
        (async () => {
            const data = await fetchData(token1, 1);
            setData1(data);
        })();
    }, [token1]);

    return (
        <Folder>
            <div className="market-details">
                <div className="head">
                    <p className="details">
                        {intl.formatMessage({ id: 'trade.marketing:' })}
                        <span className="token-pair">
                            {props.token0}/{props.token1}
                        </span>
                    </p>
                </div>
                <div className="main-content">
                    {[data0, data1].map((data, index) => (
                        <div className="main" key={index}>
                            <p className="token">{data.token}</p>
                            <ul className="props">
                                <li className="prop">
                                    <span className="label">
                                        {intl.formatMessage({
                                            id: 'trade.24h.volume',
                                        })}
                                    </span>
                                    <span className="value price">
                                        ${data.tradeVolumeUSD}
                                    </span>
                                </li>
                                <li className="prop">
                                    <span className="label">
                                        {intl.formatMessage({
                                            id: 'trade.24h.marketcap',
                                        })}
                                    </span>
                                    <span className="value price">
                                        ${data.marketCap}
                                    </span>
                                </li>
                                <li className="prop">
                                    <span className="label">
                                        {intl.formatMessage({
                                            id: 'trade.24h.hightest',
                                        })}
                                    </span>
                                    <span className="value price">
                                        ${data.priceHigh}
                                    </span>
                                </li>
                                <li className="prop">
                                    <span className="label">
                                        {intl.formatMessage({
                                            id: 'trade.24h.lowest',
                                        })}
                                    </span>
                                    <span className="value price">
                                        ${data.priceLow}
                                    </span>
                                </li>
                                <li className="prop">
                                    <span className="label">
                                        {intl.formatMessage({
                                            id: 'trade.pricefeed',
                                        })}
                                    </span>
                                    <span
                                        className="value address"
                                        onClick={() => {
                                            const url = `${process.env.BSC_SCAN_URL}/address/${data.priceFeedContract}`;
                                            window.open(url, '_blank');
                                        }}
                                    >
                                        {data.priceFeedContract?.replace(
                                            /^(0x[\d\w]{4}).*([\d\w]{4})$/,
                                            '$1...$2',
                                        )}
                                    </span>
                                </li>
                                <li className="prop">
                                    <span className="label">
                                        {data.token}{' '}
                                        {intl.formatMessage({
                                            id: 'trade.contract',
                                        })}
                                    </span>
                                    <span
                                        className="value address"
                                        onClick={() => {
                                            const url = `${process.env.BSC_SCAN_URL}/address/${data.contract}`;
                                            window.open(url, '_blank');
                                        }}
                                    >
                                        {data.contract?.replace(
                                            /^(0x[\d\w]{4}).*([\d\w]{4})$/,
                                            '$1...$2',
                                        )}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </Folder>
    );
};

export default MarketDetail;
