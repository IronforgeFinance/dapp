import './less/index.less';

import { gql, useQuery } from '@apollo/client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Table } from 'antd';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import {
    TokenView,
    PureView,
    TypeView,
    TimeView,
} from '@/components/CommonView';
import { GET_BURNS } from '@/subgraph/graphql';
import { ourClient } from '@/subgraph/clientManager';
import { DEFAULT_PAGE_SIZE } from '@/config/constants/constant';

const columns = [
    {
        title: 'Burned',
        dataIndex: 'unstakingAmount',
        render: (value, row) => (
            <TokenView
                {...row}
                noToken
                currency="fUSD"
                amount={row.cleanedDebt}
            />
        ),
    },
    {
        title: 'Unstaking',
        dataIndex: 'unstakingAmount',
        render: (value, row) => (
            <TokenView
                {...row}
                noPrice
                currency={row.unstakingCurrency}
                amount={row.unstakingAmount}
            />
        ),
    },
    {
        title: 'Minted',
        dataIndex: 'unlockedAmount',
        render: (value, row) => (
            <TokenView {...row} currency="fToken" amount={row.unlockedAmount} />
        ),
    },
    {
        title: 'F-ratio',
        dataIndex: 'ratio',
        render: (value, row) => (
            <PureView
                customData={`${(
                    (1 / parseFloat(ethers.utils.formatEther(value))) *
                    100
                ).toFixed(2)}%`}
            />
        ),
    },
    {
        title: 'Type',
        dataIndex: 'cleanedDebt',
        render: (value, row) => <TypeView {...row} currency="fUSD" />,
    },
    {
        title: 'Date',
        dataIndex: 'timestamp',
        render: (value, row) => <TimeView {...row} />,
    },
];

const BurnView = () => {
    const { account } = useWeb3React();
    const [burns, setBurns] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
    });

    const fetchBurns = useCallback(async () => {
        const { data } = await ourClient.query({
            query: GET_BURNS,
            variables: {
                offset: pagination.current - 1,
                limit: pagination.pageSize,
                user: account,
            },
        });
        setBurns(data?.burns ?? []);
    }, [account]);

    useEffect(() => {
        fetchBurns();
    }, []);

    const noData = useMemo(() => !burns?.length, [burns]);

    const position = useMemo(
        () => (pagination.total > pagination.pageSize ? 'bottomRight' : 'none'),
        [pagination],
    );

    return (
        <div className="burn-view">
            <Table
                className="custom-table"
                columns={noData ? [] : columns}
                rowKey={(record) => record.id}
                dataSource={burns}
                pagination={{ ...pagination, position: [position] }}
            />
        </div>
    );
};

export default BurnView;
