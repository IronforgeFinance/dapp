import './index.less';
import { Table } from 'antd';
import { ethers } from 'ethers';
import {
    PureView,
    LpTokenView,
    FarmViewProps,
    ActionView,
    BalanceView,
    PriceView,
} from '@/layouts/components/Footer/components/CommonView';

const columns = [
    {
        title: 'Farm',
        dataIndex: 'lpToken',
        render: (value, row) => <LpTokenView {...row} />,
    },
    {
        title: 'Staked',
        dataIndex: 'staked',
        render: (value, row) => <PriceView {...row} />,
    },
    {
        title: 'Earned',
        dataIndex: 'earned',
        render: (value, row: FarmViewProps) => (
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

const mockData: FarmViewProps[] = new Array(3).fill('').map((item, index) => ({
    id: index,
    value: {
        amount: 1000,
        price: 60000,
    },
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
            title: 'Stake',
            onClick: () => (window.location.href = '/farm'),
        },
        {
            title: 'Unstake',
            color: 'yellow',
            onClick: () => (window.location.href = '/farm'), // TODO 建议用锚点，体验会好一些
        },
    ],
}));

const FarmView = () => {
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

export default FarmView;
