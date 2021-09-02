import React, { useState, useEffect } from 'react';
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
} from '@/components/CommonView';
import useRefresh from '@/hooks/useRefresh';
import { useWeb3React } from '@web3-react/core';
import { history, useModel } from 'umi';
import { LP_TOKENS } from '@/config/';
import { useIntl } from 'umi';

const columns = [
    {
        title: 'wallet.farm',
        dataIndex: 'lpToken',
        render: (value, row) => <LpTokenView {...row} />,
    },
    {
        title: 'wallet.staked',
        dataIndex: 'staked',
        render: (value, row) => <PriceView {...row} />,
    },
    {
        title: 'wallet.earned',
        dataIndex: 'earned',
        render: (value, row: FarmViewProps) => (
            <BalanceView token0={row.earnedToken0} />
        ),
    },
    {
        textWrap: 'word-break',
        title: 'apy',
        dataIndex: 'apy',
        render: (value, row) => (
            <PureView customData={`${(row.apy * 100).toFixed(2)}%`} />
        ),
    },
    {
        title: 'action',
        dataIndex: 'actions',
        render: (value, row) => (
            <ActionView
                actions={[
                    {
                        title: 'Stake',
                        onClick: () => history.push('/farm'),
                    },
                    {
                        title: 'Unstake',
                        color: 'yellow',
                        onClick: () => history.push('/farm'), // TODO 建议用锚点，体验会好一些
                    },
                ]}
            />
        ),
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
}));

const FarmView = () => {
    const intl = useIntl();
    const [dataSource, setDataSource] = useState([]);
    const { account } = useWeb3React();
    const { fetchStakePoolList, stakeDataList } = useModel(
        'stakeData',
        (model) => ({
            ...model,
        }),
    );
    const { slowRefresh } = useRefresh();
    useEffect(() => {
        (async () => {
            if (account) {
                const list = await fetchStakePoolList(LP_TOKENS, account);
                const data = list.map((item) => {
                    const tokens = item.name.split('-');
                    return {
                        token0: {
                            name: tokens[0],
                        },
                        token1: {
                            name: tokens[1],
                        },
                        value: {
                            amount: item.staked,
                            price: (item.staked * item.lpPrice).toFixed(2),
                        },
                        earnedToken0: {
                            name: 'BS',
                            amount: item.totalPendingReward,
                        },
                        apy: item.apy,
                    };
                });
                setDataSource(data);
            }
        })();
    }, [account, slowRefresh]);
    return (
        <div className="burn-view">
            <Table
                className="custom-table"
                columns={columns.map((item) => ({
                    ...item,
                    title: intl.formatMessage({ id: item.title }),
                }))}
                rowKey={(record) => record.id}
                dataSource={dataSource}
                pagination={false}
            />
        </div>
    );
};

export default FarmView;
