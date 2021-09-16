import './less/index.less';

import { useCallback, useState, createContext, ReactNode } from 'react';
import RecordBoard from '../RecordBoard';
import DebtItem from '@/pages/Burn/components/DebtItem';

interface MyDebtsContextProps {
    visible: boolean;
    open(): void;
    close(): void;
}

export const MyDebtsContext = createContext<MyDebtsContextProps | null>(null);

interface MyDebtsProps {
    children: ReactNode;
}

export default (props: MyDebtsProps) => {
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
            <RecordBoard visible={visible} title="Your Debt" close={close}>
                <DebtItem />
            </RecordBoard>
            {children}
        </MyDebtsContext.Provider>
    );
};