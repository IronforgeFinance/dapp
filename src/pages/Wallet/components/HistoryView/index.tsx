import './less/index.less';

import { Tabs, Table } from 'antd';
import { useState, useCallback, Fragment, useMemo, useEffect } from 'react';
import { parseEnumToArray } from '@/utils';
import {
    ConjType,
    HistoryViewProps,
    IconType,
    TimeView,
    VerbType,
} from '@/components/CommonView';
import { useWeb3React } from '@web3-react/core';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import { DefiActType } from '@/config/constants/types';
import {
    BSCSCAN_EXPLORER,
    DEFAULT_PAGE_SIZE,
} from '@/config/constants/constant';
import {
    GET_OPERATIONS,
    GET_BURNS_FROM_PANCAKE,
    GET_MINTS_FROM_PANCAKE,
    GET_OPERATIONS_FUZZY,
} from '@/subgraph/graphql';
import { pancakeswapClient, ourClient } from '@/subgraph/clientManager';
import { ethers } from 'ethers';
import { useIntl } from 'umi';
import { useExchangeSystem } from '@/hooks/useContract';
import * as message from '@/components/Notification';

const { TabPane } = Tabs;

export enum TabKeys {
    'All',
    'Mint',
    'Burn',
    'Trade',
    'Farm',
    'Pool',
}

type StakeType = 'Deposit' | 'Withdraw' | 'Harvest';
type TabType = keyof typeof TabKeys;

const tabItems = parseEnumToArray(TabKeys);

const otherTypeToTabType = {
    Mint: 'Mint' as TabType,
    Burn: 'Burn' as TabType,
    Exchange: 'Trade' as TabType,
    Deposit: 'Farm' as TabType,
    Withdraw: 'Farm' as TabType,
    Harvest: 'Farm' as TabType,
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
        render: (value, row: HistoryViewProps) => {
            const intl = useIntl();

            return (
                <div className="history">
                    <div className="operation">
                        <i className={`icon ${row.icon}`} />
                        <div className="info">
                            <span>{row.type}</span>
                            <TimeView timestamp={row.dealtime} />
                        </div>
                    </div>
                    {row.token0 && (
                        <div className="form">
                            {row.token0 && (
                                <Fragment>
                                    {intl
                                        .formatMessage({
                                            id: `verb.${
                                                (row.verb as string)
                                                    .toLocaleLowerCase()
                                                    .replace(' ', '.') || 'x'
                                            }`,
                                        })
                                        .trimEnd()}{' '}
                                    <b>{row.token0.amount}</b>{' '}
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
                            {row.token1 && row.conj && (
                                <Fragment>
                                    {' '}
                                    {isOverflow(
                                        [row.token0.name, row.token0.amount],
                                        8,
                                    ) && <br />}
                                    {intl
                                        .formatMessage({
                                            id: `conj.${
                                                (row.conj as string)
                                                    .toLocaleLowerCase()
                                                    .replace(' ', '.') || 'x'
                                            }`,
                                        })
                                        .trimEnd()}{' '}
                                    <b>{row.token1.amount}</b> {row.token1.name}
                                </Fragment>
                            )}
                        </div>
                    )}
                    {row.link && (
                        <div className="skip-wraper">
                            <a
                                className="skip"
                                target="_blank"
                                href={row.link}
                            />
                        </div>
                    )}
                </div>
            );
        },
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
        link: BSCSCAN_EXPLORER,
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
        link: BSCSCAN_EXPLORER,
        dealtime: item.timestamp,
    };
};

/**
 * @returns {ReactNode}
 */
const HistoryView = () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const [tabKey, setTabKey] = useState('All' as TabType);
    const [mintsPool, setMintsPool] = useState([]);
    const [burnsPool, setBurnsPool] = useState([]);
    const [operations, setOperations] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
    });
    const [txLoading, setTxLoading] = useState(false);

    const exchangeSystem = useExchangeSystem();

    /**
     * 查询是否可以revert。只查询status 为pending的，type为Exchange 的数据。
     * status 有：pending, settled, reverted.
     * @param entryId Operation的type为Exchange的数据的id
     */
    const fetchIfCanRevert = useCallback(async (entryId: number) => {
        const canRevert = await exchangeSystem.canOnlyBeReverted(entryId);
        console.log('canRevert: ', canRevert);
        return canRevert;
    }, []);

    useEffect(() => {
        fetchIfCanRevert(1);
    }, []);

    /**
     * 执行revert交易
     * @param entryId Operation的type为Exchange的数据的id
     */
    const doRevert = async (entryId) => {
        if (account) {
            try {
                setTxLoading(true);
                const tx = await exchangeSystem.rollback(entryId);
                const receipt = await tx.wait();
                message.success('Revert successfully.');
                // revert之后需要更新这一条数据。
                setTxLoading(false);
            } catch (err) {
                console.log(err);
                setTxLoading(false);
            }
        }
    };

    /**
     * @description Fetch pool of mints from pancake site.
     * @returns {void}
     */
    const fetchMintsPool = useCallback(async () => {
        try {
            const { data } = await pancakeswapClient.query({
                query: GET_MINTS_FROM_PANCAKE,
                variables: {
                    offset: pagination.current - 1,
                    limit: pagination.pageSize * 0.25,
                    user: account,
                },
            });
            setMintsPool(data.mints.map(useParseDataOfPancake('mint')));
        } catch (error) {
            console.error(error);
        }
    }, [account]);
    /**
     * @description Fetch pool of burns from pancake site.
     * @returns {void}
     */
    const fetchBurnsPool = useCallback(async () => {
        try {
            const { data } = await pancakeswapClient.query({
                query: GET_BURNS_FROM_PANCAKE,
                variables: {
                    offset: pagination.current - 1,
                    limit: pagination.pageSize * 0.25,
                    user: account,
                },
            });
            setBurnsPool(data.burns.map(useParseDataOfPancake('burn')));
        } catch (error) {
            console.error(error);
        }
    }, [account]);

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
        if (tabKey === 'Farm') {
            return ['Deposit', 'Withdraw', 'Harvest'];
        }
        return tabKey;
    }, [tabKey]);

    /**
     * @description
     * @returns {void}
     */
    const fetchOperations = useCallback(async () => {
        try {
            const { data } = await ourClient.query({
                query: Array.isArray(requestType)
                    ? GET_OPERATIONS_FUZZY
                    : GET_OPERATIONS,
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
    }, [account, requestType]);

    useEffect(() => {
        setPagination({ ...pagination, current: 1 });

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
            case 'Farm': {
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
        }
    }, [tabKey, requestType]);

    const changeTab = useCallback((tabKey) => setTabKey(tabKey), []);

    /**
     * @property {boolean} isEnd
     */
    const isEnd = useMemo(
        () => !(mintsPool?.length || burnsPool?.length || operations?.length),
        [mintsPool, burnsPool, operations],
    );

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

    return (
        <div className="history-view">
            <Tabs
                className="custom-tabs"
                defaultActiveKey={tabKey}
                onChange={changeTab}
            >
                {tabItems.map((tabKey) => (
                    <TabPane
                        tab={intl.formatMessage({
                            id: `wallet.tab.${(
                                tabKey as string
                            ).toLowerCase()}`,
                        })}
                        key={tabKey}
                    >
                        <Table
                            className="custom-table"
                            columns={columns}
                            rowKey={(record) => record.id}
                            dataSource={records}
                            pagination={false}
                        />
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
};

export default HistoryView;
