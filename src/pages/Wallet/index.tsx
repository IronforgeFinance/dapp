import React from 'react';
import './index.less';
import BigBoard from './BigBoard';
import HoldingView from './HoldingView';
import PoolView from './PoolView';
import HistoryView from './HistoryView';
import FarmView from './FarmView';
import { useIntl } from 'umi';

const tabItems = [
    // {
    //     name: 'Holding',
    //     key: 'holding',
    // },
    {
        name: 'wallet.pool',
        key: 'pool',
    },
    {
        name: 'wallet.farm',
        key: 'farm',
    },
    {
        name: 'history',
        key: 'history',
    },
];

export default () => {
    const intl = useIntl();
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
                title={intl.formatMessage({ id: 'wallet.title' })}
                tabItems={tabItems}
                tabKey={tabKey}
                onChange={(key) => setTabKey(key)}
            >
                {CurrentView}
            </BigBoard>
        </div>
    );
};
