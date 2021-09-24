import './pc.less';
import './mobile.less';

import { Tabs, Table, Button, Popover } from 'antd';
import {
    useState,
    useCallback,
    Fragment,
    useMemo,
    useEffect,
    useContext,
} from 'react';
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
    GET_MINTS_FROM_PANCAKE_TOTAL,
    GET_BURNS_FROM_PANCAKE_TOTAL,
} from '@/subgraph/graphql';
import { pancakeswapClient, ourClient } from '@/subgraph/clientManager';
import { TransitionConfirmContext } from '@/components/TransactionConfirm';
import { ethers } from 'ethers';
import { useIntl } from 'umi';
import { useExchangeSystem } from '@/hooks/useContract';
import { isDeliveryAsset } from '@/utils';
import * as message from '@/components/Notification';
import NoneView from '@/components/NoneView';
import ISwitch from '@/components/Switch';
import useMounted from '@/hooks/useMounted';
import usePagination from '@/hooks/usePagination';

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
        link: `${BSCSCAN_EXPLORER}tx/${item.txhash}`,
        dealtime: item.timestamp,
    });

/**
 * @description From our subgraph
 * @param {any}
 * @returns {HistoryViewProps}
 */
const parseDataOfOur = (item): HistoryViewProps => {
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
        status: item.status,
        link: `${BSCSCAN_EXPLORER}tx/${item.txhash}`,
        dealtime: item.timestamp,
        canRevert: item.canRevert,
    };
};

/**
 * @returns {ReactNode}
 */
const HistoryView = () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const [tabKey, setTabKey] = useState('All' as TabType);
    const [operations, setOperations] = useState([]);
    const [checked, setChecked] = useState(true);
    const mounted = useMounted();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
    });
    const exchangeSystem = useExchangeSystem();

    const mintsTable = usePagination({
        client: pancakeswapClient,
        listGql: GET_MINTS_FROM_PANCAKE,
        totalGql: GET_MINTS_FROM_PANCAKE_TOTAL,
        parser: useParseDataOfPancake('mint'),
        key: 'mints',
        // extVars: { user: '' },
    });
    const burnsTable = usePagination({
        client: pancakeswapClient,
        listGql: GET_BURNS_FROM_PANCAKE,
        totalGql: GET_BURNS_FROM_PANCAKE_TOTAL,
        parser: useParseDataOfPancake('burn'),
        key: 'burns',
        // extVars: { user: '' },
    });

    const columns = [
        {
            title: 'history',
            dataIndex: 'id',
            render: (value, row: HistoryViewProps) => {
                const intl = useIntl();
                const [txLoading, setTxLoading] = useState(false);
                const { open: openConfirmModal } = useContext(
                    TransitionConfirmContext,
                );

                /**@description 交易前的确认 */
                const openRevertConfirm = useCallback(async () => {
                    setTxLoading(true);

                    openConfirmModal({
                        view: 'trade',
                        fromToken: {
                            name: row.token0.name,
                            amount: row.token0.amount,
                        },
                        toToken: {
                            name: row.token1.name,
                            amount: row.token1.amount,
                        },
                        type: isDeliveryAsset(row.token0.name)
                            ? 'Delivery'
                            : 'Perpetuation',
                        confirm: async () => await doRevert(row.id),
                        final: () => setTxLoading(false),
                    });
                }, [row]);

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
                            <p>
                                {row.token0 && (
                                    <Fragment>
                                        {intl
                                            .formatMessage({
                                                id: `verb.${
                                                    (row.verb as string)
                                                        .toLocaleLowerCase()
                                                        .replace(' ', '.') ||
                                                    'x'
                                                }`,
                                            })
                                            .trimEnd()}{' '}
                                        <b>{row.token0.amount}</b>{' '}
                                        {row.token0.name}
                                    </Fragment>
                                )}
                                {row.token1 && row.conj && (
                                    <Fragment>
                                        {intl
                                            .formatMessage({
                                                id: `conj.${
                                                    (row.conj as string)
                                                        .toLocaleLowerCase()
                                                        .replace(' ', '.') ||
                                                    'x'
                                                }`,
                                            })
                                            .trimEnd()}{' '}
                                        <b>{row.token1.amount}</b>{' '}
                                        {row.token1.name}
                                    </Fragment>
                                )}
                            </p>
                        )}
                        <div className="last-wraper">
                            {row.link && (
                                <a
                                    className="skip"
                                    target="_blank"
                                    href={row.link}
                                />
                            )}
                            {row?.status !== 'pending' &&
                                row.type === 'Trade' && (
                                    <i className="icon-success-green size-24" />
                                )}
                            {row?.status === 'pending' && (
                                <i className="loading size-18" />
                            )}
                            <Button
                                className="revert-btn common-btn common-btn-red"
                                onClick={openRevertConfirm}
                                loading={txLoading}
                                style={{
                                    visibility:
                                        row?.status === 'pending'
                                            ? 'visible'
                                            : 'hidden',
                                }}
                            >
                                Revert
                            </Button>
                            <Popover
                                placement="leftBottom"
                                trigger="hover"
                                content="xxxxxxx"
                            >
                                <i
                                    style={{
                                        visibility:
                                            row?.status === 'pending'
                                                ? 'visible'
                                                : 'hidden',
                                        marginLeft: 6,
                                    }}
                                    className="icon-question size-18"
                                />
                            </Popover>
                        </div>
                    </div>
                );
            },
        },
    ];

    /**
     * 查询是否可以revert。只查询status 为pending的，type为Exchange 的数据。
     * status 有：pending, settled, reverted.
     * @param entryId Operation的type为Exchange的数据的id
     */
    const fetchIfCanRevert = useCallback(async (entryId: number) => {
        const canRevert = await exchangeSystem.canOnlyBeReverted(entryId);
        return canRevert;
    }, []);

    /**
     * 执行revert交易
     * @param entryId Operation的type为Exchange的数据的id
     */
    const doRevert = async (entryId) => {
        if (account) {
            try {
                const tx = await exchangeSystem.rollback(entryId);
                const receipt = await tx.wait();
                message.success('Revert successfully.');
                // revert之后需要更新这一条数据。
                const _operations = operations.slice();
                const index = _operations.findIndex(
                    (item) => item.id === entryId,
                );
                if (index > -1) {
                    _operations[index].status = 'reverted';
                    _operations[index].canRevert = false;
                    setOperations(_operations);
                }
            } catch (err) {
                console.log(err);
                if (err && err.code === 4001) {
                    message.error({
                        message: 'Transaction rejected',
                        description: 'Rejected by user',
                    });
                    return;
                }
                message.error('Revert failed.');
            }
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
            for (let i = 0; i < data.operations.length; i++) {
                const item = data.operations[i];
                if (item.type === 'Exchange' && item.status === 'pending') {
                    const res = await fetchIfCanRevert(item.id);
                    item.canRevert = res;
                }
            }
            setOperations(data.operations);
        } catch (error) {
            console.error(error);
        }
    }, [account, requestType]);

    useEffect(() => {
        if (!mounted.current) return;

        setPagination({ ...pagination, current: 1 });

        switch (tabKey) {
            case 'All': {
                mintsTable.reset();
                burnsTable.reset();
                fetchOperations();
                break;
            }
            case 'Mint': {
                mintsTable.clear();
                burnsTable.clear();
                fetchOperations();
                break;
            }
            case 'Burn': {
                mintsTable.clear();
                burnsTable.clear();
                fetchOperations();
                break;
            }
            case 'Trade': {
                mintsTable.clear();
                burnsTable.clear();
                fetchOperations();
                break;
            }
            case 'Farm': {
                mintsTable.clear();
                burnsTable.clear();
                fetchOperations();
                break;
            }
            case 'Pool': {
                mintsTable.reset();
                burnsTable.reset();
                setOperations([]);
                break;
            }
        }
    }, [tabKey, requestType]);

    const changeTab = useCallback((tabKey) => setTabKey(tabKey), []);

    /**
     * @description Combine all kinds of datas for unified data format
     */
    const records = useMemo(() => {
        const handledData = operations.map(parseDataOfOur);
        return [...handledData, ...mintsTable.list, ...burnsTable.list].sort(
            ((a, b) => Number(b.dealtime) - Number(a.dealtime)) as (
                a: HistoryViewProps,
                b: HistoryViewProps,
            ) => number,
        );
    }, [mintsTable, burnsTable, operations]);

    const noneStatus = useMemo(() => {
        if (!account) {
            return 'noConnection';
        }
        if (!records?.length) {
            return 'noRecords';
        }
    }, [account, records]);

    return (
        <div className="history-view">
            {!noneStatus && (
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
                            <ISwitch
                                checkedChildren="Live"
                                unCheckedChildren="Finished"
                                onChange={setChecked}
                                checked={checked}
                            />
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
            )}
            {noneStatus && <NoneView type={noneStatus} />}
        </div>
    );
};

export default HistoryView;
