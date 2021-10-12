import './pc.less';
import './mobile.less';

import { Table, Popover } from 'antd';
import { PureView, TimeView } from '@/components/CommonView';
import { GET_BURNS, GET_BURNS_TOTAL } from '@/subgraph/graphql';
import NoneView from '@/components/NoneView';
import usePagination from '@/hooks/usePagination';
import { TokenIcon } from '@/components/Icon';
import { Fragment, useState, useMemo } from 'react';
import ISwitch from '@/components/Switch';

const DeliveryView = () => {
    const [checked, setChecked] = useState(true);
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
        none: 'noRecords',
    });

    const isLive = useMemo(() => checked, [checked]);
    const isFinished = useMemo(() => !checked, [checked]);

    const columns = [
        {
            title: 'fAsset',
            dataIndex: 'unstakingAmount',
            render: (value, row) => (
                <div className="f-asset">
                    <TokenIcon name="bs" />
                    <span>lBTCUSD_210924</span>
                    {isLive && (
                        <div className="rest-days">
                            <span>55Days</span>
                            <Popover
                                content="Active debts are part of the Public Debt Pool and will fluctuate with changes in the public debt"
                                trigger="hover"
                                placement="top"
                            >
                                <i className="icon-question size-16" />
                            </Popover>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Delivery Value',
            dataIndex: 'unlockedAmount',
            render: (value, row) => (
                <div className="delivery-value">
                    <span>$ 20000.00</span>
                    <span>40000 BNB</span>
                </div>
            ),
        },
        {
            title: 'Delivery Price',
            dataIndex: 'unlockedAmount',
            render: (value, row) => <PureView customData={'$ 2000.00'} />,
        },
        {
            title: 'Date',
            dataIndex: 'timestamp',
            render: (value, row) => <TimeView {...row} />,
        },
    ];

    if (isLive) {
        columns.splice(2, 1);
    }

    return (
        <div className="delivery-view">
            {!noneStatus && (
                <Fragment>
                    <div className="switch-wrapper">
                        <ISwitch
                            checkedChildren="Live"
                            unCheckedChildren="Finished"
                            onChange={setChecked}
                            checked={checked}
                        />
                    </div>
                    <Table
                        className="custom-table"
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={burns}
                        pagination={{ ...pagination, position: [position] }}
                        onChange={(pagination) => setPagination(pagination)}
                    />
                </Fragment>
            )}
            {noneStatus && <NoneView type={noneStatus} />}
        </div>
    );
};

export default DeliveryView;
