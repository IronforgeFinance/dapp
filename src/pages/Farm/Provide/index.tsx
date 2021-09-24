import './pc.less';
import './mobile.less';

import React, { useState, useMemo, Fragment } from 'react';
import TabGroup from '@/components/TabGroup';
import ProvideForm from './components/ProvideForm';
import WithdrawForm from './components/WithdrawForm';
import IconBack from '@/assets/images/icon-back.png';
import { history } from 'umi';

import { Tabs } from 'antd';
import IsShow from '@/components/IsShow';
const { TabPane } = Tabs;
import { useIntl } from 'umi';

export const ITabKeyContext = React.createContext<string>('');

export default (props) => {
    const intl = useIntl();
    const { location } = props;
    const { action } = location.query;
    const [tabKey, setTabKey] = useState(action || '1');
    const onTabChange = (key) => {
        console.log(key);
        setTabKey(key);
    };

    const provideTitle = intl.formatMessage({ id: 'liquidity.tab.provide' });
    const withdrawTitle = intl.formatMessage({ id: 'liquidity.tab.withdraw' });

    const tabItems = useMemo(
        () => [
            {
                name: provideTitle,
                key: '1',
            },
            {
                name: withdrawTitle,
                key: '2',
            },
        ],
        [provideTitle, withdrawTitle],
    );

    return (
        <Fragment>
            <button className="back-btn" onClick={() => history.goBack()} />
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
                        <ITabKeyContext.Provider value={tabKey}>
                            <IsShow condition={tabKey === '1'}>
                                <ProvideForm />
                            </IsShow>
                            <IsShow condition={tabKey === '2'}>
                                <WithdrawForm />
                            </IsShow>
                        </ITabKeyContext.Provider>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
