import { useMemo, useState } from 'react';
import useEnv from './useEnv';

const usePreloadImages = () => {
    const { path, isMobile } = useEnv();

    const preloadImages = useMemo(() => {
        const commonFiles = isMobile
            ? [
                  'header-logo.d4e433a9.png',
                  'footer-icon-history.d818a958.png',
                  'footer-icon-52days.d3341e2c.png',
                  'mobile-form-box-bg.aa7dcb43.png',
                  'icon-axe.0b91ea44.png',
                  'icon-lock.1a41515a.png',
                  'icon-coin.6b5dcb6a.png',
                  'icon-magic-bottle.56c0fd18.png',
                  'mint-select-token-dialog.efa361ab.png',
                  'common-btn-red.8266a4fa.png',
                  'common-btn-yellow.3cb8c8c9.png',
              ]
            : [
                  'common-box-bg.558d532d.png',
                  'common-btn-red.8266a4fa.png',
                  'mint-select-token-dialog.efa361ab.png',
                  'header-logo.d4e433a9.png',
                  'npc-dialog-mint-person.617f727c.png',
                  'icon-axe.0b91ea44.png',
                  'icon-lock.1a41515a.png',
                  'icon-coin.6b5dcb6a.png',
                  'icon-magic-bottle.56c0fd18.png',
              ];

        const pageFiles = (() => {
            if (isMobile) {
                switch (path) {
                    case '/':
                        return [
                            'blacksmith.0d9279a9.png',
                            'common-box-bg.558d532d.png',
                        ];
                    case '/mint':
                        return ['mobile-mint-bg.38426275.png'];
                    case '/burn':
                        return ['mobile-burn-bg.c423936e.jpg'];
                    case '/trade':
                        return [
                            'trade-swap-roof-sign.8ee0f0a8.png',
                            'trade-swap-roof-sign-active.e536e325.png',
                            'trade-swap-roof-ceiling.ea6c8001.png',
                            'trade-market-detail-bg.33e78ff7.png',
                            'mobile-trade-bg.95a8b836.jpg',
                        ];
                    case '/farm':
                        return [
                            'farm-header-bg.dd80a50e.png',
                            'pool-item-bg.194b755e.png',
                            'gem-yellow.57a2043c.png',
                            'gem-red.e400d6ac.png',
                            'trade-bg.cc7288da.png',
                        ];
                    case '/farm/provide':
                        return [
                            'farm-header-bg.dd80a50e.png',
                            'lp-list-bg.9283f4cb.png',
                        ];
                    case '/wallet':
                        return [
                            'trade-bg.cc7288da.png',
                            'big-board-bg.e4ba3e39.png',
                            'big-board-tab-bg.a8931d83.png',
                            'big-board-tab-bg-active.e2f9d7b2.png',
                        ];
                }
            } else {
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
                    case '/farm/provide':
                        return [
                            'farm-header-bg.dd80a50e.png',
                            'lp-list-bg.9283f4cb.png',
                        ];
                    case '/wallet':
                        return [
                            'trade-bg.cc7288da.png',
                            'big-board-bg.e4ba3e39.png',
                            'big-board-tab-bg.a8931d83.png',
                            'big-board-tab-bg-active.e2f9d7b2.png',
                        ];
                }
            }
        })();

        return commonFiles.concat(pageFiles);
    }, [path]);

    return { preloadImages: preloadImages ?? [] };
};

export default usePreloadImages;
