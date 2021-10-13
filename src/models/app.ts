import { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import { useCollateralSystem } from '@/hooks/useContract';
import {
    getAssetSystemContract,
    getCollateralSystemContract,
} from '@/utils/contractHelper';
import { ethers } from 'ethers';
const MOBILE_WIDTH = 414;
const useAppModel = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [collateralTokens, setCollateralTokens] = useState([]);
    const [mintTokens, setMintTokens] = useState([]);
    const [connectWalletSignal, setConnectWalletSignal] = useState(0);
    const getWindowScreen = throttle(() => {
        const isMobile = window.innerWidth <= MOBILE_WIDTH;
        setIsMobile(isMobile);
    }, 100);

    const fetchCollateralTokens = async () => {
        const collateralSystem = getCollateralSystemContract();
        let i = 0;
        const tokens = [];
        while (true) {
            try {
                const symbol = await collateralSystem.tokenSymbol(i);
                tokens.push({ name: ethers.utils.parseBytes32String(symbol) });
                i++;
            } catch (err) {
                break;
            }
        }
        console.log('fetchCollateralTokens:  ', tokens);
        setCollateralTokens(tokens);
    };
    const fetchMintTokens = async () => {
        const assetSystem = getAssetSystemContract();
        let i = 0;
        const tokens = [];
        while (true) {
            try {
                const assetAddress = await assetSystem.mAssetList(i);
                const assetSymbol = await assetSystem.mAddress2Names(
                    assetAddress,
                );
                const symbol = ethers.utils.parseBytes32String(assetSymbol);
                console.log('assetSymbol: ', symbol);
                if (symbol) {
                    tokens.push({ name: symbol });
                    i++;
                } else {
                    break;
                }
            } catch (err) {
                break;
            }
        }
        console.log('fetchCollateralTokens:  ', tokens);
        setMintTokens(tokens);
    };
    useEffect(() => {
        getWindowScreen();
        window.addEventListener('resize', getWindowScreen, false);

        fetchCollateralTokens();
        fetchMintTokens();
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
        collateralTokens,
        mintTokens,
        setConnectWalletSignal,
    };
};

export default useAppModel;
