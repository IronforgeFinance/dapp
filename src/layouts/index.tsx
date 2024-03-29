import './pc.less';
import './mobile.less';

import { Fragment, useEffect, useRef, useMemo } from 'react';
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
import MobileNavigationContextProvider from './components/Header/components/MobileNavigation/provider';
import HistoryBoardContextProvider from '@/components/HistoryBoard/provider';
import NpcDialogContextProvider from '@/components/NpcDialog/provider';
import MyDebtsContextProvider from '@/components/MyDebts/provider';
import DeliveryHistoryContextProvider from '@/components/DeliveryHistory/provider';
import ClaimRewardsContextProvider from '@/components/ClaimRewards/provider';
import LangContextProvider from './components/LangSwitcher/provider';
import TokenSelectorProvider from '@/components/TokenSelector/provider';
import DeliveryHistory from '@/components/DeliveryHistory';
import PreloadAssets from '@/components/PreloadAssets';
import Loading from '@/components/Loading';

export default function Layout({ children, location }: IRouteComponentProps) {
    const { isMobile, path } = useEnv();
    const { account } = useWeb3React();
    const { clearDataView } = useModel('dataView', (model) => ({
        clearDataView: model.clearDataView,
    }));
    const player = useRef<HTMLVideoElement>(null);

    const isDev = () => {
        return process.env.NODE_ENV === 'development';
    };

    const conatinerClass = useMemo(() => {
        return `${path.slice(1).replace('/', '-') || 'home'}-container`;
    }, [path]);

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
            <PreloadAssets.Suspense loading={<Loading />}>
                <PreloadAssets />
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
                <LangContextProvider>
                    <TokenSelectorProvider>
                        <LoadingContextProvider>
                            <MobileNavigationContextProvider>
                                <HistoryBoardContextProvider>
                                    <NpcDialogContextProvider>
                                        <MyDebtsContextProvider>
                                            <DeliveryHistoryContextProvider>
                                                <ClaimRewardsContextProvider>
                                                    {/* 多为弹窗组件，优势：复用、防止包含块、单例（避免多实例造成内存浪费）、支持跨层（调用灵活）。相关操作方法由provider提供 */}
                                                    <Fragment>
                                                        <HistoryBoard />
                                                        <MyDebts />
                                                        <DeliveryHistory />
                                                        <ClaimRewards />
                                                        {!isMobile && (
                                                            <Fragment>
                                                                <TokenSelector />
                                                                <NpcDialog />
                                                            </Fragment>
                                                        )}
                                                    </Fragment>

                                                    {/* 页面内容 */}
                                                    <Fragment>
                                                        <CommonHeader />

                                                        <TransactionConfirm>
                                                            <section
                                                                className={
                                                                    conatinerClass
                                                                }
                                                            >
                                                                {isMobile && (
                                                                    <Fragment>
                                                                        <TokenSelector />
                                                                    </Fragment>
                                                                )}
                                                                {children}
                                                            </section>
                                                        </TransactionConfirm>
                                                        {!isMobile && (
                                                            <CommonFooter />
                                                        )}
                                                    </Fragment>
                                                </ClaimRewardsContextProvider>
                                            </DeliveryHistoryContextProvider>
                                        </MyDebtsContextProvider>
                                    </NpcDialogContextProvider>
                                </HistoryBoardContextProvider>
                            </MobileNavigationContextProvider>
                        </LoadingContextProvider>
                    </TokenSelectorProvider>
                </LangContextProvider>
            </PreloadAssets.Suspense>
        </div>
    );
}
