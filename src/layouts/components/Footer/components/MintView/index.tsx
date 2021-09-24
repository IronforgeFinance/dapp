import './pc.less';
import './mobile.less';

import { Table } from 'antd';
import { ethers } from 'ethers';
import {
    TokenView,
    PureView,
    TypeView,
    TimeView,
} from '@/components/CommonView';
import { GET_MINTS, GET_MINTS_TOTAL } from '@/subgraph/graphql';
import { useIntl } from 'umi';
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
    const {
        list: mints,
        setPagination,
        pagination,
        position,
        noneStatus,
    } = usePagination({
        listGql: GET_MINTS,
        totalGql: GET_MINTS_TOTAL,
        key: 'mints',
    });

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
                    onChange={(pagination) => setPagination(pagination)}
                />
            )}
            {noneStatus && <NoneView type={noneStatus} />}
        </div>
    );
};

export default MintView;
