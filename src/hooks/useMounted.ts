import { useRef, useLayoutEffect } from 'react';

const useMounted = () => {
    const mounted = useRef(false);

    /**@description Init mounted state before fetching */
    useLayoutEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    return mounted;
};

export default useMounted;
