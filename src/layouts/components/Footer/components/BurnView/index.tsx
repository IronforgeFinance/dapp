import './index.less';
import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Table } from 'antd';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
    TokenView,
    PureView,
    TypeView,
    TimeView,
} from '@/components/CommonView';

const GET_BURNS = gql`
    query ($offset: Int, $limit: Int, $user: String) {
        burns(skip: $offset, first: $limit, where: { user: $user }) {
            id
            user
            unstakingAmount
            unstakingCurrency
            unlockedAmount
            cleanedDebt
            timestamp
            ratio
            txhash
        }
    }
`;

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
                customData={`${+ethers.utils.formatUnits(value, 18) * 100}%`}
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
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const { account } = useWeb3React();

    const { data } = useQuery(GET_BURNS, {
        variables: {
            offset: pagination.current - 1,
            limit: pagination.pageSize,
            user: account,
        },
    });

    const burns = useMemo(() => data?.burns ?? [], [data]);

    useEffect(() => {
        console.log('query burns data %o', data?.burns);
    }, [burns]);

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
