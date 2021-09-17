import { useRef, useLayoutEffect } from 'react';

const usePagination = () => {
    const mounted = useRef(false);

    /**@description Init mounted state before fetching */
    useLayoutEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    return mounted.current;
};

export default usePagination;
