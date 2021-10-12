import { useCallback, useState, createContext, ReactNode } from 'react';

interface DeliveryHistoryContextProps {
    visible: boolean;
    open(): void;
    close(): void;
}

export const DeliveryHistoryContext =
    createContext<DeliveryHistoryContextProps | null>(null);

interface MyDebtsProviderProps {
    children?: ReactNode;
}

export default (props: MyDebtsProviderProps) => {
    const { children } = props;
    const [visible, setVisible] = useState(false);

    const close = useCallback(() => {
        setVisible(false);
    }, []);
    const open = useCallback(() => {
        setVisible(true);
    }, []);

    return (
        <DeliveryHistoryContext.Provider
            value={{
                open,
                close,
                visible,
            }}
        >
            {children}
        </DeliveryHistoryContext.Provider>
    );
};
