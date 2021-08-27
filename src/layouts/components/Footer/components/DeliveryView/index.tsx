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
    DebtView,
} from '../CommonView';

const GET_MINTS = gql`
    query ($offset: Int, $limit: Int, $user: String) {
        mints(
            skip: $offset
            first: $limit
            where: { user: $user, collateralCurrency_contains: "-" }
        ) {
            id
            user
            collateralCurrency
            collateralAmount
            lockedAmount
            mintedCurrency
            mintedAmount
            timestamp
            ratio
            txhash
        }
    }
`;

const columns = [
    {
        title: 'Collateral',
        dataIndex: 'collateralAmount',
        render: (value, row) => (
            <TokenView
                {...row}
                noToken
                currency={row.collateralCurrency}
                amount={row.collateralAmount}
            />
        ),
    },
    {
        title: 'Locked',
        dataIndex: 'lockedAmount',
        render: (value, row) => (
            <TokenView
                {...row}
                noPrice
                currency="fToken"
                amount={row.lockedAmount}
            />
        ),
    },
    {
        title: 'Minted',
        dataIndex: 'mintedAmount',
        render: (value, row) => (
            <TokenView
                {...row}
                currency={row.mintedCurrency}
                amount={row.mintedAmount}
            />
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
        dataIndex: 'mintedCurrency',
        render: (value, row) => (
            <TypeView {...row} currency={row.mintedCurrency} />
        ),
    },
    {
        title: 'Debt',
        dataIndex: 'mintedCurrency',
        render: (value, row) => (
            <DebtView
                {...row}
                currency={row.mintedCurrency}
                amount={row.mintedAmount}
                deliveryCurrency="fUSD"
            />
        ),
    },
    {
        title: 'Date',
        dataIndex: 'timestamp',
        render: (value, row) => <TimeView {...row} />,
    },
];

const DeliveryView = () => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const { account } = useWeb3React();

    const { data } = useQuery(GET_MINTS, {
        variables: {
            offset: pagination.current - 1,
            limit: pagination.pageSize,
            user: account,
        },
    });

    const mints = useMemo(() => data?.mints ?? [], [data]);

    useEffect(() => {
        console.log('query mints data %o', data?.mints);
    }, [mints]);

    const noData = useMemo(() => !mints?.length, [mints]);

    const position = useMemo(
        () => (pagination.total > pagination.pageSize ? 'bottomRight' : 'none'),
        [pagination],
    );

    return (
        <div className="mint-view">
            <Table
                className="custom-table"
                columns={noData ? [] : columns}
                rowKey={(record) => record.id}
                dataSource={mints}
                pagination={{ ...pagination, position: [position] }}
            />
        </div>
    );
};

export default DeliveryView;
