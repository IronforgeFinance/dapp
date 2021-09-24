import './less/index.less';

import { useMemo } from 'react';
import { useModel } from 'umi';
import { Table } from 'antd';
import { useWeb3React } from '@web3-react/core';
import { TokenView, PureView, PriceView } from '@/components/CommonView';
import NoneView, { NoneTypes } from '@/components/NoneView';

const columns = [
    {
        title: '质押物',
        dataIndex: 'collateralToken',
        render: (value, row) => (
            <TokenView {...row} currency={row.collateralToken} />
        ),
    },
    {
        title: '质押率',
        dataIndex: 'ratio',
        render: (value, row) => <PureView customData={value} />,
    },
    {
        title: '数量',
        dataIndex: 'collateral',
        render: (value, row) => <PureView customData={value} />,
    },
    {
        title: '锁定',
        dataIndex: 'locked',
        render: (value, row) => <PureView customData={value} />,
    },
];

export default (props) => {
    const { account } = useWeb3React();
    const { totalDebtInUSD, debtItemInfos } = useModel('burnData', (model) => ({
        ...model,
    }));

    const noneStatus: NoneTypes = useMemo(() => {
        if (!account) {
            return 'noConnection';
        }
        if (!debtItemInfos?.length) {
            return 'noAssets';
        }
    }, [account, debtItemInfos]);

    return (
        <div className="debt-item">
            {!noneStatus && (
                <section className="your-debts">
                    <div className="summary">
                        <div className="data">
                            <span className="label">Your Debt Value</span>
                            <span className="value">{totalDebtInUSD} fUSD</span>
                        </div>
                    </div>
                </section>
            )}
            <div className="content-box">
                {!noneStatus && (
                    <Table
                        className="custom-table"
                        columns={columns}
                        rowKey={(record) => record.collateralToken}
                        dataSource={debtItemInfos}
                        pagination={false}
                    />
                )}
                {noneStatus && <NoneView type={noneStatus} />}
            </div>
        </div>
    );
};
