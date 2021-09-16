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
import { GET_MINTS } from '@/subgraph/graphql';
import { ourClient } from '@/subgraph/clientManager';
import { DEFAULT_PAGE_SIZE } from '@/config/constants/constant';
import { useIntl } from 'umi';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import dayjs from 'dayjs';
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
                customData={`${(
                    (1 / parseFloat(ethers.utils.formatEther(value))) *
                    100
                ).toFixed(2)}%`}
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
        title: 'Date',
        dataIndex: 'timestamp',
        render: (value, row) => <TimeView {...row} />,
    },
];

const MintView = () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const [mints, setMints] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
    });

    const fetchMints = useCallback(async () => {
        const { data } = await ourClient.query({
            query: GET_MINTS,
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
                    columns={columns.map((col) => ({
                        ...col,
                        title: intl.formatMessage({
                            id: `history.mint.col.${(
                                col.title as string
                            ).toLocaleLowerCase()}`,
                        }),
                    }))}
                    rowKey={(record) => record.id}
                    dataSource={mints}
                    pagination={{ ...pagination, position: [position] }}
                />
            )}
            {noneStatus && <NoneView type={noneStatus} />}
        </div>
    );
};

export default MintView;
