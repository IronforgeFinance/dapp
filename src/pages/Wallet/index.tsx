import './pc.less';
import './mobile.less';

import React from 'react';
import PoolView from './components/PoolView';
import HistoryView from './components/HistoryView';
import FarmView from './components/FarmView';
import TabRecordBoard from '@/components/TabRecordBoard';
import { useIntl } from 'umi';
import { ReactComponent as TabBackIcon02 } from '@/assets/images/big-board-svg-02.svg';
import { ReactComponent as TabBackIcon03 } from '@/assets/images/big-board-svg-03.svg';
import { ReactComponent as TabBackIcon04 } from '@/assets/images/big-board-svg-04.svg';

const tabItems = [
    {
        name: 'wallet.pool',
        key: 'pool',
        icon: <TabBackIcon02 fill="#89512D" />,
    },
    {
        name: 'wallet.farm',
        key: 'farm',
        icon: <TabBackIcon03 fill="#89512D" />,
    },
    {
        name: 'history',
        key: 'history',
        icon: <TabBackIcon04 fill="#89512D" />,
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
        <div className="wallet-container">
            <TabRecordBoard
                title={intl.formatMessage({ id: 'wallet.title' })}
                tabItems={tabItems.map((item) => ({
                    ...item,
                    name: intl.formatMessage({ id: item.name }),
                }))}
                tabKey={tabKey}
                onChange={(key) => setTabKey(key)}
            >
                {CurrentView}
            </TabRecordBoard>
        </div>
    );
};
