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
import { DELIVERY_TOKENS } from '@/config';
import { getRemainDaysOfQuarterAsset, getTokenPrice } from '@/utils';
import dayjs from 'dayjs';
import Tokens from '@/config/constants/tokens';
import { getBep20Contract } from '@/utils/contractHelper';
import { ethers } from 'ethers';
import { toFixedWithoutRound } from '@/utils/bigNumber';
const DeliveryView = () => {
    const [checked, setChecked] = useState(true);
    const customFetch = async (account: string) => {
        const list = [];
        for (let i = 0; i < DELIVERY_TOKENS.length; i++) {
            const token = DELIVERY_TOKENS[i];
            const contractAddress =
                Tokens[token].address[process.env.APP_CHAIN_ID];
            const contract = getBep20Contract(contractAddress);
            const balance = ethers.utils.formatEther(
                await contract.balanceOf(account),
            );
            const price = await getTokenPrice(token);
            const quarter = token.split('_')[1];
            const date = dayjs([
                Number('20' + quarter.substr(0, 2)),
                Number(quarter.substr(2, 2)) - 1, // month starts from 0
                Number(quarter.substr(4)),
            ]).endOf('month');
            const remainDays = getRemainDaysOfQuarterAsset(quarter);
            const timestamp = date.unix();
            const deliveryValue = toFixedWithoutRound(
                price * Number(balance),
                2,
            );
            list.push({
                token,
                price,
                remainDays,
                timestamp,
                balance: toFixedWithoutRound(balance, 4),
                deliveryValue,
            });
        }
        return { data: { dataSource: list } };
    };
    const {
        list: dataSource,
        setPagination,
        pagination,
        position,
        noneStatus,
    } = usePagination({
        customFetch,
        key: 'dataSource',
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
                    <span>{row.token}</span>
                    {isLive && (
                        <div className="rest-days">
                            <span>{row.remainDays}days</span>
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
                    <span>$ {row.deliveryValue}</span>
                    <span>
                        {row.balance} {row.token}
                    </span>
                </div>
            ),
        },
        {
            title: 'Delivery Price',
            dataIndex: 'unlockedAmount',
            render: (value, row) => <PureView customData={'$' + row.price} />,
        },
        {
            title: 'Delivery Date',
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
                        dataSource={dataSource}
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
