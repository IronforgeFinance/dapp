import './less/index.less';

import React, { useState, useEffect, useMemo } from 'react';
import { Table } from 'antd';
import { ethers } from 'ethers';
import {
    PureView,
    LpTokenView,
    PoolViewProps,
    ActionView,
    BalanceView,
} from '@/components//CommonView';
import { PROVIDED_LP_TOKENS } from '@/config';
import { history, useModel } from 'umi';
import { useWeb3React } from '@web3-react/core';
import useRefresh from '@/hooks/useRefresh';
import { useIntl } from 'umi';
import NoneView from '@/components/NoneView';

const columns = [
    {
        title: 'wallet.pool',
        dataIndex: 'lpToken',
        render: (value, row) => <LpTokenView {...row} />,
        width: '25%',
    },
    {
        title: 'balance',
        dataIndex: 'balance',
        render: (value, row) => <BalanceView {...row} />,
        width: '25%',
    },
    // {
    //     title: 'Earned',
    //     dataIndex: 'earned',
    //     render: (value, row: PoolViewProps) => (
    //         <BalanceView
    //             {...row}
    //             token0={row.earnedToken0}
    //             token1={row.earnedToken1}
    //         />
    //     ),
    // },
    // {
    //     title: 'APY',
    //     dataIndex: 'apy',
    //     render: (value, row) => (
    //         <PureView
    //             customData={`${+ethers.utils.formatUnits(value, 18) * 100}%`}
    //         />
    //     ),
    // },
    {
        title: 'action',
        dataIndex: 'actions',
        width: '50%',
        render: (value, row) => (
            <ActionView
                actions={[
                    {
                        title: 'Provide',
                        onClick: () => history.push('/farm/provide'),
                    },
                    {
                        title: 'Withdraw',
                        color: 'yellow',
                        onClick: () => history.push('/farm/provide?action=2'),
                    },
                ]}
            />
        ),
    },
];

const mockData: PoolViewProps[] = new Array(3).fill('').map((item, index) => ({
    id: index,
    token0: {
        name: 'ETH',
        amount: '0.03',
    },
    token1: {
        name: 'fUSD',
        amount: '0.05',
    },
    earnedToken0: {
        name: 'fUSD',
        amount: '0.05',
    },
    earnedToken1: {
        name: 'USDC',
        amount: '0.05',
    },
    apy: '400000000000000000',
}));

const PoolView = () => {
    const intl = useIntl();
    const [dataSource, setDataSource] = useState([]);
    const { account } = useWeb3React();
    const { slowRefresh } = useRefresh();
    const { lpDataList, setLpDataList, fetchLpDataInfo, fetchLpDataList } =
        useModel('lpData', (model) => ({ ...model }));

    const refresh = async () => {
        try {
            const list = await fetchLpDataList(PROVIDED_LP_TOKENS, account);
            const data = list.map((item) => {
                return {
                    address: item.address,
                    token0: {
                        name: item.token1,
                        amount: item.token1Balance,
                    },
                    token1: {
                        name: item.token2,
                        amount: item.token2Balance,
                    },
                };
            });
            setDataSource(data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (account) {
            refresh();
        }
    }, [account, slowRefresh]);

    const noneStatus = useMemo(() => {
        if (!account) {
            return 'noConnection';
        }
        if (!dataSource?.length) {
            return 'noAssets';
        }
    }, [account, dataSource]);

    return (
        <div className="pool-view">
            {!noneStatus && (
                <Table
                    className="custom-table"
                    columns={columns.map((item) => ({
                        ...item,
                        title: intl.formatMessage({ id: item.title }),
                    }))}
                    rowKey={(record) => record.address}
                    dataSource={dataSource}
                    pagination={false}
                />
            )}
            <NoneView type={noneStatus} />
        </div>
    );
};

export default PoolView;
