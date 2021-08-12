import React from 'react';
import './index.less';
import { useState } from 'react';
import BigBoard from './BigBoard';

const tabItems = [
    {
        name: 'Holding',
        key: 'holding',
    },
    {
        name: 'Pool',
        key: 'pool',
    },
    {
        name: 'Farm',
        key: 'farm',
    },
    {
        name: 'History',
        key: 'history',
    },
];

export default () => {
    const [tabKey, setTabKey] = useState(tabItems[0].key);

    return (
        <div className="wallet">
            <BigBoard
                title="My Wallet"
                tabItems={tabItems}
                tabKey={tabKey}
                onChange={(key) => setTabKey(key)}
            />
        </div>
    );
};
