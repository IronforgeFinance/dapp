import './less/index.less';

import { Table } from 'antd';
import { ethers } from 'ethers';
import {
    TokenView,
    PureView,
    TypeView,
    TimeView,
} from '@/components/CommonView';
import { GET_BURNS, GET_BURNS_TOTAL } from '@/subgraph/graphql';
import NoneView from '@/components/NoneView';
import usePagination from '@/hooks/usePagination';

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
    const {
        list: burns,
        setPagination,
        pagination,
        position,
        noneStatus,
    } = usePagination({
        listGql: GET_BURNS,
        totalGql: GET_BURNS_TOTAL,
        key: 'burns',
    });

    return (
        <div className="burn-view">
            {!noneStatus && (
                <Table
                    className="custom-table"
                    columns={columns}
                    rowKey={(record) => record.id}
                    dataSource={burns}
                    pagination={{ ...pagination, position: [position] }}
                    onChange={(pagination) => setPagination(pagination)}
                />
            )}
            {noneStatus && <NoneView type={noneStatus} />}
        </div>
    );
};

export default BurnView;
