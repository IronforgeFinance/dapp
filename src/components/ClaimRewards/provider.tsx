import './less/index.less';

import { createContext, useCallback, useState, ReactNode } from 'react';

interface ClaimRewardsContextProps {
    visable: boolean;
    open(): void;
    close(): void;
}

interface ClaimRewardsProps {
    children?: ReactNode;
}

export const ClaimRewardsContext =
    createContext<ClaimRewardsContextProps | null>(null);

const ClaimRewardsContextProvider = (props: ClaimRewardsProps) => {
    const { children } = props;
    const [visable, setVisable] = useState(false);

    const close = useCallback(() => setVisable(false), []);
    const open = useCallback(() => setVisable(true), []);

    return (
        <ClaimRewardsContext.Provider
            value={{
                visable,
                close,
                open,
            }}
        >
            {children}
        </ClaimRewardsContext.Provider>
    );
};

export default ClaimRewardsContextProvider;
