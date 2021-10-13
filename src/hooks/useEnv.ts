import { useState, useEffect } from 'react';
import { history } from 'umi';
import debounce from 'lodash.debounce';

/**
 * @description 环境信息
 */
export const useEnv = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [path, setPath] = useState('');

    useEffect(() => {
        const handleResize = debounce(() => {
            // console.log(
            //     '>> is mobile: %s',
            //     /mobile/gi.test(navigator.userAgent) ||
            //         window.innerWidth <= 750,
            // );

            setIsMobile(
                /mobile/gi.test(navigator.userAgent) ||
                    window.innerWidth <= 750,
            );
        }, 200);

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setPath(window.location!.pathname);

        return history.listen((location) => {
            setPath(location!.pathname);
        });
    }, []);

    return { isMobile, path };
};

export default useEnv;
