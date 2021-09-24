import { useState, createContext } from 'react';

export interface LoadingContextProps {
    loading: boolean;
    setLoading(boolean);
}

export const LoadingContext = createContext<LoadingContextProps | null>(null);

const LoadingContextProvider = (props) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {props.children}
        </LoadingContext.Provider>
    );
};

export default LoadingContextProvider;
