import React, { useState } from 'react';
import StakeForm from './components/StakeForm';
import UnstakeForm from './components/UnstakeForm';
import './index.less';
import { history } from 'umi';

import { Tabs } from 'antd';
const { TabPane } = Tabs;
export enum STAKE_TABS {
    stake = 'stake',
    unstake = 'unstake',
}
export default () => {
    const [tabKey, setTabKey] = useState(STAKE_TABS.stake);
    const onTabChange = (key) => {
        console.log(key);
        setTabKey(key);
    };
    return (
        <div className="provide-container">
            <div className="custom-tabs">
                <Tabs onChange={onTabChange} type="card">
                    <TabPane tab="Stake" key={STAKE_TABS.stake}></TabPane>
                    <TabPane tab="Unstake" key={STAKE_TABS.unstake}></TabPane>
                </Tabs>
                <div className="tab-content">
                    <button
                        className="common-btn-back icon-back"
                        onClick={() => {
                            history.goBack();
                        }}
                    />
                    <StakeForm tabKey={tabKey} />
                </div>
            </div>
        </div>
    );
};
