import { useState, createContext, ReactNode, useCallback } from 'react';
import { tabItems } from './index';

interface HistoryBoardContextProps {
    openWithTabKey(number?): void;
    visible: boolean;
    setVisible(boolean): void;
    tabKey: string;
    setTabKey(string): void;
}

export const HistoryBoardContext =
    createContext<HistoryBoardContextProps | null>(null);

interface HistoryBoardContextProviderProps {
    children?: ReactNode;
}

export default (props: HistoryBoardContextProviderProps) => {
    const { children } = props;
    const [visible, setVisible] = useState(false);
    const [tabKey, setTabKey] = useState(tabItems[0].key);

    const openWithTabKey = useCallback(
        (tabKey = 0) => {
            setTabKey(tabItems[tabKey].key);
            setVisible(true);
        },
        [visible, tabKey],
    );

    return (
        <HistoryBoardContext.Provider
            value={{ visible, setVisible, openWithTabKey, tabKey, setTabKey }}
        >
            {children}
        </HistoryBoardContext.Provider>
    );
};
