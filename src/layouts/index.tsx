import './less/index.less';

import { useEffect, useRef } from 'react';
import { IRouteComponentProps } from 'umi';
import CommonHeader from './components/Header';
import CommonFooter from './components/Footer';
import classNames from 'classnames';
import { useModel } from 'umi';
import useEnv from '@/hooks/useEnv';
import { useWeb3React } from '@web3-react/core';
import NpcDialog from '@/components/NpcDialog';
import ClaimRewards from '@/components/ClaimRewards';
import TokenSelector from '@/components/TokenSelector';
import TransactionConfirm from '@/components/TransactionConfirm';
import MyDebts from '@/components/MyDebts';
import LoadingContextProvider from '@/contexts/LoadingContext';
import HistoryBoard from '@/components/HistoryBoard';
import MobileNavigationContextProvider from './components/Header/components/MobileNavigation/MobileNavigationProvider';
import HistoryBoardContextProvider from '@/components/HistoryBoard/HistoryBoardContextProvider';

export default function Layout({
    children,
    location,
    route,
    history,
    match,
}: IRouteComponentProps) {
    const isMobile = useEnv();
    const { account } = useWeb3React();
    const { clearDataView } = useModel('dataView', (model) => ({
        clearDataView: model.clearDataView,
    }));
    const player = useRef<HTMLVideoElement>(null);

    const isDev = () => {
        return process.env.NODE_ENV === 'development';
    };

    useEffect(() => {
        if (!isMobile) {
            if (location.pathname === '/mint') {
                player.current.src = isDev()
                    ? 'http://localhost:5000/files/mint.webm'
                    : './static/mint.webm';
                player.current.play();
            } else if (location.pathname === '/burn') {
                player.current.src = isDev()
                    ? 'http://localhost:5000/files/burn.webm'
                    : './static/burn.webm';
                player.current.play();
            } else {
                player.current.src = '';
                player.current.pause();
            }
        }

        clearDataView();
    }, [location, account]);
    return (
        <div className="container">
            {!isMobile && (
                <video
                    loop
                    autoPlay
                    muted
                    ref={player}
                    className={classNames({
                        'container-video': true,
                        'container-mint': location.pathname === '/mint',
                        'container-burn': location.pathname === '/burn',
                        'container-trade': [
                            '/trade',
                            '/farm',
                            '/wallet',
                            '/farm/provide',
                            '/farm/stake',
                        ].includes(location.pathname),
                        'container-home': location.pathname === '/',
                    })}
                >
                    <source
                        // src="https://blz.nosdn.127.net/1/tm/hearthstone/activities/barrens/landing-kv-dfesffs42.webm"
                        src="http://localhost:5000/files/mint.webm" // 必须是服务器提供的视频资源，本地开发使用简单的静态服务器
                        type="video/webm"
                    />
                </video>
            )}
            <LoadingContextProvider>
                <MobileNavigationContextProvider>
                    <HistoryBoardContextProvider>
                        <HistoryBoard>
                            <CommonHeader />
                        </HistoryBoard>
                        <MyDebts>
                            <TransactionConfirm>
                                <TokenSelector>
                                    <ClaimRewards>
                                        <NpcDialog>{children}</NpcDialog>
                                    </ClaimRewards>
                                </TokenSelector>
                            </TransactionConfirm>
                        </MyDebts>
                        {!isMobile && <CommonFooter />}
                    </HistoryBoardContextProvider>
                </MobileNavigationContextProvider>
            </LoadingContextProvider>
        </div>
    );
}
