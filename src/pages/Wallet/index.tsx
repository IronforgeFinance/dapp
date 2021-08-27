import React from 'react';
import './index.less';
import BigBoard from './BigBoard';
import HoldingView from './HoldingView';
import PoolView from './PoolView';
import HistoryView from './HistoryView';
import FarmView from './FarmView';

const tabItems = [
    // {
    //     name: 'Holding',
    //     key: 'holding',
    // },
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
    const [tabKey, setTabKey] = React.useState(tabItems[0].key);

    const CurrentView = React.useMemo(() => {
        switch (tabKey) {
            // case 'holding': {
            //     return <HoldingView />;
            // }
            case 'pool': {
                return <PoolView />;
            }
            case 'farm': {
                return <FarmView />;
            }
            case 'history': {
                return <HistoryView />;
            }
            default:
                return null;
        }
    }, [tabKey]);

    return (
        <div className="wallet">
            <BigBoard
                title="My Wallet"
                tabItems={tabItems}
                tabKey={tabKey}
                onChange={(key) => setTabKey(key)}
            >
                {CurrentView}
            </BigBoard>
        </div>
    );
};
