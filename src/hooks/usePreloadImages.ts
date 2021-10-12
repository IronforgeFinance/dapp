import { useMemo, useState } from 'react';
import useEnv from './useEnv';

const usePreloadImages = () => {
    const { path } = useEnv();

    const preloadImages = useMemo(() => {
        switch (path) {
            case '/':
                return [
                    'blacksmith.0d9279a9.png',
                    'merchant.7d6b379d.png',
                    'home-bg.e59719ff.jpg',
                ];
            case '/mint':
                return ['mint_bg.e913ca4b.jpg'];
            case '/burn':
                return ['burn_bg.548665b0.jpg'];
            case '/trade':
                return [
                    'trade-swap-roof-sign.8ee0f0a8.png',
                    'trade-swap-roof-sign-active.e536e325.png',
                    'trade-swap-roof-ceiling.ea6c8001.png',
                    'trade-market-detail-bg.33e78ff7.png',
                    'trade-bg.cc7288da.png',
                ];
            case '/farm':
                return [
                    'farm-header-bg.dd80a50e.png',
                    'pool-item-bg.194b755e.png',
                    'gem-yellow.57a2043c.png',
                    'gem-red.e400d6ac.png',
                    'trade-bg.cc7288da.png',
                ];
            case '/wallet':
                return [
                    'trade-bg.cc7288da.png',
                    'big-board-bg.e4ba3e39.png',
                    'big-board-tab-bg.a8931d83.png',
                    'big-board-tab-bg-active.e2f9d7b2.png',
                ];
        }
    }, [path]);

    return { preloadImages: preloadImages ?? [] };
};

export default usePreloadImages;
