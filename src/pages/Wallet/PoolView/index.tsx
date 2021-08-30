import './index.less';
import { Table } from 'antd';
import { ethers } from 'ethers';
import {
    PureView,
    LpTokenView,
    PoolViewProps,
    ActionView,
    BalanceView,
} from '@/layouts/components/Footer/components/CommonView';

const columns = [
    {
        title: 'Pool',
        dataIndex: 'lpToken',
        render: (value, row) => <LpTokenView {...row} />,
    },
    {
        title: 'Balance',
        dataIndex: 'balance',
        render: (value, row) => <BalanceView {...row} />,
    },
    {
        title: 'Earned',
        dataIndex: 'earned',
        render: (value, row: PoolViewProps) => (
            <BalanceView
                {...row}
                token0={row.earnedToken0}
                token1={row.earnedToken1}
            />
        ),
    },
    {
        title: 'APY',
        dataIndex: 'apy',
        render: (value, row) => (
            <PureView
                customData={`${+ethers.utils.formatUnits(value, 18) * 100}%`}
            />
        ),
    },
    {
        title: 'Action',
        dataIndex: 'actions',
        render: (value, row) => <ActionView {...row} />,
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
    actions: [
        {
            title: 'Provide',
            onClick: () => (window.location.href = '/farm/provide'),
        },
        {
            title: 'Withdraw',
            color: 'yellow',
            onClick: () =>
                (window.location.href = '/farm/provide?action=withdraw'),
        },
    ],
}));

const PoolView = () => {
    return (
        <div className="burn-view">
            <Table
                className="custom-table"
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={mockData}
                pagination={false}
            />
        </div>
    );
};

export default PoolView;
