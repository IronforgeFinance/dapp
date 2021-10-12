import './pc.less';
import './mobile.less';

import {
    useState,
    useMemo,
    Fragment,
    useContext,
    useCallback,
    ReactNode,
} from 'react';
import { useIntl } from 'umi';
import TabRecordBoard from '@/components/TabRecordBoard';
import MintView from '@/layouts/components/Footer/components/MintView';
import BurnView from '@/layouts/components/Footer/components/BurnView';
import DeliveryView from '@/layouts/components/Footer/components/DeliveryView';
import { ReactComponent as TabBackIcon01 } from '@/assets/images/big-board-svg-01.svg';
import { ReactComponent as TabBackIcon02 } from '@/assets/images/big-board-svg-02.svg';
import { ReactComponent as TabBackIcon03 } from '@/assets/images/big-board-svg-03.svg';
import { HistoryBoardContext } from './provider';

export const tabItems = [
    {
        name: 'history.mint',
        key: 'mint',
        icon: <TabBackIcon01 fill="#89512D" />,
    },
    {
        name: 'history.burn',
        key: 'burn',
        icon: <TabBackIcon02 fill="#89512D" />,
    },
    // {
    //     name: 'history.delivery',
    //     key: 'delivery',
    //     icon: <TabBackIcon03 fill="#89512D" />,
    // },
];

export const useHistoryBoard = () => {
    return useContext(HistoryBoardContext);
};

interface HistoryBoardProps {
    children?: ReactNode;
}

export default (props: HistoryBoardProps) => {
    const intl = useIntl();
    const { children } = props;
    const { visible, setVisible, tabKey, setTabKey } =
        useContext(HistoryBoardContext);

    const CurrentView = useMemo(() => {
        switch (tabKey) {
            case tabItems[0].key: {
                return <MintView />;
            }
            case tabItems[1].key: {
                return <BurnView />;
            }
            // case tabItems[2].key: {
            //     return <DeliveryView />;
            // }
            default:
                return null;
        }
    }, [tabKey]);

    return (
        <Fragment>
            <TabRecordBoard
                title={intl.formatMessage({ id: 'history' })}
                tabItems={tabItems.map((item) => ({
                    ...item,
                    name: intl.formatMessage({ id: item.name }),
                }))}
                tabKey={tabKey}
                onChange={(key) => setTabKey(key)}
                close={() => setVisible(false)}
                visible={visible}
                mode="modal"
            >
                {visible && CurrentView}
            </TabRecordBoard>
            {children}
        </Fragment>
    );
};
