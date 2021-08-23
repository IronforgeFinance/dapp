import React, { useState } from 'react';
import StakeForm from './components/StakeForm';
import TabGroup from '@/components/TabGroup';
import UnstakeForm from './components/UnstakeForm';
import './index.less';
import { history } from 'umi';

import { Tabs } from 'antd';
const { TabPane } = Tabs;
export enum STAKE_TABS {
    stake = 'stake',
    unstake = 'unstake',
}

const tabItems = [
    {
        name: 'Stake',
        key: 'stake',
    },
    {
        name: 'Unstake',
        key: 'unstake',
    },
];

export default (props) => {
    // const [tabKey, setTabKey] = useState(STAKE_TABS.stake);
    const [tabKey, setTabKey] = useState(tabItems[0].key);
    const onTabChange = (key) => {
        console.log(key);
        setTabKey(key);
    };
    const { query } = props.location;
    return (
        <div className="provide-container">
            <div className="custom-tabs">
                {/* <Tabs onChange={onTabChange} type="card">
                    <TabPane tab="Stake" key={STAKE_TABS.stake}></TabPane>
                    <TabPane tab="Unstake" key={STAKE_TABS.unstake}></TabPane>
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
                    <StakeForm tabKey={tabKey} lp={query.lp} />
                </div>
            </div>
        </div>
    );
};
