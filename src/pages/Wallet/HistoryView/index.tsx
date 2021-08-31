import './index.less';

import { Tabs, Table } from 'antd';
import { useState, useCallback, Fragment, useMemo, useEffect } from 'react';
import { parseEnumToArray } from '@/utils';
import {
    ConjType,
    HistoryViewProps,
    IconType,
    VerbType,
} from '@/components/CommonView';
import { useWeb3React } from '@web3-react/core';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import { DefiActType } from '@/config/constants/types';
import {
    GET_OPERATIONS,
    GET_BURNS_FROM_PANCAKE,
    GET_MINTS_FROM_PANCAKE,
} from '@/config/constants/graphql';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ethers } from 'ethers';

const pancakeswapClient = new ApolloClient({
    uri: process.env.PACAKE_GRAPH_URL,
    cache: new InMemoryCache(),
});

const ourClient = new ApolloClient({
    uri: process.env.OUR_GRAPH_URL,
    cache: new InMemoryCache(),
});

const { TabPane } = Tabs;

export enum TabKeys {
    'All',
    'Mint',
    'Burn',
    'Trade',
    'Pool',
}

type StakeType = 'Deposit' | 'Withdraw' | 'Harvest';
type TabType = keyof typeof TabKeys;

const tabItems = parseEnumToArray(TabKeys);

const otherTypeToTabType = {
    Mint: 'Mint' as TabType,
    Burn: 'Burn' as TabType,
    Exchange: 'Trade' as TabType,
    Deposit: 'Farm',
    Withdraw: 'Farm',
    Harvest: 'Farm',
};

const otherTypeToVerbType = {
    Mint: 'From' as VerbType,
    Burn: 'From' as VerbType,
    Exchange: 'Send' as VerbType,
    Deposit: 'Stake LP' as VerbType,
    Withdraw: 'Stake LP' as VerbType,
    Harvest: 'Stake LP' as VerbType,
};

const otherTypeToConjType = {
    Mint: 'To' as ConjType,
    Burn: 'To' as ConjType,
    Exchange: 'To' as ConjType,
    Deposit: '' as ConjType,
    Withdraw: '' as ConjType,
    Harvest: '' as ConjType,
};

const poolTypeToTabType = {
    mint: 'Pool' as TabType,
    burn: 'Pool' as TabType,
};

const poolTypeToVerbType = {
    mint: 'Provide Liquidity' as VerbType,
    burn: 'Withdraw Liquidity' as VerbType,
};

const poolTypeToConjType = {
    mint: 'and' as ConjType,
    burn: 'and' as ConjType,
};

function isOverflow(origins, len = 12): boolean {
    if (!origins?.length) return false;
    if (!Array.isArray(origins)) origins = [origins];

    return origins.some((item) => String(item)?.length > len);
}

const columns = [
    {
        title: 'history',
        dataIndex: 'id',
        render: (value, row: HistoryViewProps) => (
            <div className="history">
                <div className="operation">
                    <i className={`icon ${row.icon}`} />
                    <div className="info">
                        <span>{row.type}</span>
                        <time>
                            {new Date(
                                Number(row.dealtime) * 1000,
                            ).toLocaleString()}
                        </time>
                    </div>
                </div>
                {row.token0 && (
                    <div className="form">
                        {row.token0 && (
                            <Fragment>
                                {row.verb} <b>{row.token0.amount}</b>{' '}
                                {isOverflow([row.token0.name], 8) ? (
                                    <Fragment>
                                        <br />
                                        {row.token0.name}
                                    </Fragment>
                                ) : (
                                    row.token0.name
                                )}
                            </Fragment>
                        )}
                        {row.token1 && (
                            <Fragment>
                                {' '}
                                {isOverflow(
                                    [row.token0.name, row.token0.amount],
                                    8,
                                ) && <br />}
                                {row.conj} <b>{row.token1.amount}</b>{' '}
                                {row.token1.name}
                            </Fragment>
                        )}
                    </div>
                )}
                {row.link && (
                    <div className="skip-wraper">
                        <button
                            className="skip"
                            onClick={() => (window.location.href = row.link)}
                        />
                    </div>
                )}
            </div>
        ),
    },
];

/**
 * @description Parse data of pool which is from pancake site.
 * @param {HistoryViewProps} item
 * @returns {void}
 */
const useParseDataOfPancake =
    (type: 'mint' | 'burn') =>
    (item): HistoryViewProps => ({
        id: item.id,
        icon: `pool-${type}`,
        type: poolTypeToTabType[type] as DefiActType,
        verb: poolTypeToVerbType[type],
        conj: poolTypeToConjType[type],
        token0: {
            name: item.pair.token0.name,
            amount: toFixedWithoutRound(item.amount0, 6),
        },
        token1: {
            name: item.pair.token1.name,
            amount: toFixedWithoutRound(item.amount1, 6),
        },
        link: '/mint',
        dealtime: item.timestamp,
    });

/**
 * @description From our subgraph
 * @param {any}
 * @returns {HistoryViewProps}
 */
const parseDataOfOur = (item): HistoryViewProps => {
    console.log(
        '>> otherTypeToTabType[item.type] is %s',
        otherTypeToTabType[item.type],
    );
    return {
        id: item.id,
        icon: (
            otherTypeToTabType[item.type] as string
        ).toLowerCase() as IconType,
        type: otherTypeToTabType[item.type] as DefiActType,
        verb: otherTypeToVerbType[item.type] as VerbType,
        conj: otherTypeToConjType[item.type] as ConjType,
        token0: {
            name: item.fromCurrency,
            amount: toFixedWithoutRound(
                ethers.utils.formatUnits(item.fromAmount, 18),
                6,
            ),
        },
        token1: {
            name: item.toCurrency,
            amount: toFixedWithoutRound(
                ethers.utils.formatUnits(item.toAmount, 18),
                6,
            ),
        },
        link: '/mint',
        dealtime: item.timestamp,
    };
};

/**
 * @returns {ReactNode}
 */
const HistoryView = () => {
    const { account } = useWeb3React();
    const [tabKey, setTabKey] = useState('All' as TabType);
    const [mintsPool, setMintsPool] = useState([]);
    const [burnsPool, setBurnsPool] = useState([]);
    const [operations, setOperations] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 200,
        total: 0,
    });

    /**
     * @description Fetch pool of mints from pancake site.
     * @returns {void}
     */
    const fetchMintsPool = async () => {
        try {
            const { data } = await pancakeswapClient.query({
                query: GET_MINTS_FROM_PANCAKE,
                variables: {
                    offset: pagination.current - 1,
                    limit: pagination.pageSize * 0.25,
                    // user: account,
                    user: '',
                },
            });
            setMintsPool(data.mints.map(useParseDataOfPancake('mint')));
        } catch (error) {
            console.error(error);
        }
    };
    /**
     * @description Fetch pool of burns from pancake site.
     * @returns {void}
     */
    const fetchBurnsPool = async () => {
        try {
            const { data } = await pancakeswapClient.query({
                query: GET_BURNS_FROM_PANCAKE,
                variables: {
                    offset: pagination.current - 1,
                    limit: pagination.pageSize * 0.25,
                    // user: account,
                    user: '',
                },
            });
            setBurnsPool(data.burns.map(useParseDataOfPancake('burn')));
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * @description Calculate request type for filtering.
     */
    /** @type {string} */
    const requestType = useMemo(() => {
        if (tabKey === 'All') {
            return '';
        }
        if (tabKey === 'Trade') {
            return 'Exchange';
        }
        return tabKey;
    }, [tabKey]);

    /**
     * @description
     * @returns {void}
     */
    const fetchOperations = async () => {
        try {
            const { data } = await ourClient.query({
                query: GET_OPERATIONS,
                variables: {
                    offset: pagination.current - 1,
                    limit: pagination.pageSize * 0.5,
                    user: account,
                    type: requestType,
                },
            });
            setOperations(data.operations);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        switch (tabKey) {
            case 'All': {
                fetchMintsPool();
                fetchBurnsPool();
                fetchOperations();
                break;
            }
            case 'Mint': {
                setMintsPool([]);
                setBurnsPool([]);
                fetchOperations();
                break;
            }
            case 'Burn': {
                setMintsPool([]);
                setBurnsPool([]);
                fetchOperations();
                break;
            }
            case 'Trade': {
                setMintsPool([]);
                setBurnsPool([]);
                fetchOperations();
                break;
            }
            case 'Pool': {
                fetchMintsPool();
                fetchBurnsPool();
                setOperations([]);
                break;
            }
            default:
        }
    }, [tabKey, requestType]);

    const changeTab = useCallback((tabKey) => setTabKey(tabKey), []);

    /**
     * @description Combine all kinds of datas for unified data format
     */
    const records = useMemo(() => {
        const handledData = operations.map(parseDataOfOur);
        return [...handledData, ...mintsPool, ...burnsPool].sort(
            ((a, b) => Number(b.dealtime) - Number(a.dealtime)) as (
                a: HistoryViewProps,
                b: HistoryViewProps,
            ) => number,
        );
    }, [mintsPool, burnsPool, operations]);
    const noData = useMemo(() => !records?.length, [records]);
    const position = useMemo(
        () => (pagination.total > pagination.pageSize ? 'bottomRight' : 'none'),
        [pagination],
    );

    return (
        <div className="history-view">
            <Tabs
                className="custom-tabs"
                defaultActiveKey={tabKey}
                onChange={changeTab}
            >
                {tabItems.map((tabKey) => (
                    <TabPane tab={tabKey} key={tabKey}>
                        <Table
                            className="custom-table"
                            columns={noData ? [] : columns}
                            rowKey={(record) => record.id}
                            dataSource={records}
                            pagination={{ ...pagination, position: [position] }}
                        />
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
};

export default HistoryView;
