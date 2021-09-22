import './less/index.less';

import { useState, createContext, ReactNode } from 'react';

export interface MobileNavigationContextProps {
    visible: boolean;
    setVisible(boolean): void;
}

export const MobileNavigationContext =
    createContext<MobileNavigationContextProps | null>(null);

export interface MobileNavigationProps {
    children?: ReactNode;
}

const MobileNavigationContextProvider = (props: MobileNavigationProps) => {
    const { children } = props;
    const [visible, setVisible] = useState(false);

    return (
        <MobileNavigationContext.Provider value={{ visible, setVisible }}>
            {children}
        </MobileNavigationContext.Provider>
    );
};

export default MobileNavigationContextProvider;
