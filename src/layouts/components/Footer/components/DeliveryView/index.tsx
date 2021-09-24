import './less/index.less';

import { Table } from 'antd';
import { ethers } from 'ethers';
import {
    TokenView,
    PureView,
    TypeView,
    TimeView,
    DebtView,
} from '@/components/CommonView';
import {
    GET_MINTS_BY_COLLATERAL,
    GET_MINTS_BY_COLLATERAL_TOTAL,
} from '@/subgraph/graphql';
import NoneView from '@/components/NoneView';
import usePagination from '@/hooks/usePagination';

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
    const {
        list: mints,
        setPagination,
        pagination,
        position,
        noneStatus,
    } = usePagination({
        listGql: GET_MINTS_BY_COLLATERAL,
        totalGql: GET_MINTS_BY_COLLATERAL_TOTAL,
        key: 'mints',
    });

    return (
        <div className="mint-view">
            {!noneStatus && (
                <Table
                    className="custom-table"
                    columns={columns}
                    rowKey={(record) => record.id}
                    dataSource={mints}
                    pagination={{ ...pagination, position: [position] }}
                    onChange={(pagination) => setPagination(pagination)}
                />
            )}
            {noneStatus && <NoneView type={noneStatus} />}
        </div>
    );
};

export default DeliveryView;
