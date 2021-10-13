import { useState, useEffect } from 'react';
import { throttle } from 'lodash';

const MOBILE_WIDTH = 414;
const useAppModel = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [connectWalletSignal, setConnectWalletSignal] = useState(0);
    const getWindowScreen = throttle(() => {
        const isMobile = window.innerWidth <= MOBILE_WIDTH;
        setIsMobile(isMobile);
    }, 100);
    useEffect(() => {
        getWindowScreen();
        window.addEventListener('resize', getWindowScreen, false);
        return () => {
            window.removeEventListener('resize', getWindowScreen, false);
        };
    }, []);
    const requestConnectWallet = () => {
        setConnectWalletSignal(new Date().getTime());
    };
    return {
        isMobile,
        connectWalletSignal,
        requestConnectWallet,
        setConnectWalletSignal,
    };
};

export default useAppModel;
