import { useCallback, useState, createContext, ReactNode } from 'react';

interface MyDebtsContextProps {
    visible: boolean;
    open(): void;
    close(): void;
}

export const MyDebtsContext = createContext<MyDebtsContextProps | null>(null);

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
        <MyDebtsContext.Provider
            value={{
                open,
                close,
                visible,
            }}
        >
            {children}
        </MyDebtsContext.Provider>
    );
};
