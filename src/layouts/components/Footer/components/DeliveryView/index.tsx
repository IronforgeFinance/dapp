import './less/index.less';

import { useQuery } from '@apollo/client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Table } from 'antd';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import {
    TokenView,
    PureView,
    TypeView,
    TimeView,
    DebtView,
} from '@/components/CommonView';
import { GET_MINTS_BY_COLLATERAL } from '@/subgraph/graphql';
import { ourClient } from '@/subgraph/clientManager';
import { DEFAULT_PAGE_SIZE } from '@/config/constants/constant';
import NoneView from '@/components/NoneView';

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
    const { account } = useWeb3React();
    const [mints, setMints] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
    });

    const fetchMints = useCallback(async () => {
        const { data } = await ourClient.query({
            query: GET_MINTS_BY_COLLATERAL,
            variables: {
                offset: pagination.current - 1,
                limit: pagination.pageSize,
                user: account,
            },
        });
        setMints(data?.mints ?? []);
    }, [account]);

    useEffect(() => {
        fetchMints();
    }, []);

    const noData = useMemo(() => !mints?.length, [mints]);

    const position = useMemo(
        () => (pagination.total > pagination.pageSize ? 'bottomRight' : 'none'),
        [pagination],
    );

    const noneStatus = useMemo(() => {
        if (!account) {
            return 'noConnection';
        }
        if (!mints?.length) {
            return 'noAssets';
        }
    }, [account, mints]);

    return (
        <div className="mint-view">
            {!noneStatus && (
                <Table
                    className="custom-table"
                    columns={noData ? [] : columns}
                    rowKey={(record) => record.id}
                    dataSource={mints}
                    pagination={{ ...pagination, position: [position] }}
                />
            )}
            {noneStatus && <NoneView type={noneStatus} />}
        </div>
    );
};

export default DeliveryView;
