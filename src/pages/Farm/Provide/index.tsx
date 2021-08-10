import React, { useState } from 'react';
import TabGroup from '@/components/TabGroup';
import ProvideForm from './components/ProvideForm';
import WithdrawForm from './components/WithdrawForm';
import './index.less';
import IconBack from '@/assets/images/icon-back.png';
import { history } from 'umi';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

const tabItems = [
    {
        name: 'Provide',
        key: '1',
    },
    {
        name: 'Widthdraw',
        key: '2',
    },
];

export default () => {
    const [tabKey, setTabKey] = useState('1');
    const onTabChange = (key) => {
        console.log(key);
        setTabKey(key);
    };
    return (
        <div className="provide-container">
            <div className="custom-tabs">
                {/* <Tabs onChange={onTabChange} type="card">
                    <TabPane tab="Provide" key="1"></TabPane>
                    <TabPane tab="Withdraw" key="2"></TabPane>
                </Tabs> */}
                <TabGroup
                    items={tabItems}
                    value={tabKey}
                    onChange={onTabChange}
                />
                <div className="tab-content">
                    <button
                        className="common-btn-back icon-back"
                        onClick={() => {
                            history.goBack();
                        }}
                    />
                    {tabKey === '1' && <ProvideForm />}
                    {tabKey === '2' && <WithdrawForm />}
                </div>
            </div>
        </div>
    );
};
