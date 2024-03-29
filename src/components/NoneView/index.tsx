import './pc.less';
import './mobile.less';

import {
    Fragment,
    useContext,
    useEffect,
    useCallback,
    useLayoutEffect,
    useRef,
} from 'react';
import { useModel, useIntl, history } from 'umi';
import { TabRecordBoardContext } from '@/components/TabRecordBoard';
import { MyDebtsContext } from '@/components/MyDebts/provider';
import { LoadingContext } from '@/contexts/LoadingContext';
import Loading from '../Loading';

export type NoneTypes =
    | 'noAssets'
    | 'noConnection'
    | 'noRecords'
    | 'loading'
    | undefined;
export interface NoneViewProps {
    type: NoneTypes;
}

const NoneView = (props: NoneViewProps) => {
    const { type } = props;
    const intl = useIntl();
    const { close } =
        useContext(TabRecordBoardContext) ?? useContext(MyDebtsContext) ?? {};
    const { loading } = useContext(LoadingContext);
    // const orginalZIndex = useRef<string | null>(null);

    const { requestConnectWallet, connectWalletSignal } = useModel(
        'app',
        (model) => ({
            connectWalletSignal: model.connectWalletSignal,
            requestConnectWallet: () => {
                const header: HTMLElement =
                    document.querySelector('.header-nav');
                // if (!orginalZIndex.current) {
                //     orginalZIndex.current =
                //         window.getComputedStyle(header).zIndex;
                // }
                header.style.zIndex = '2000';

                model.requestConnectWallet();
            },
        }),
    );

    const gotoMint = useCallback(() => {
        history.push('/mint');
        close && close();
    }, [close]);

    useLayoutEffect(() => {
        if (connectWalletSignal === 0) {
            const header: HTMLElement = document.querySelector('.header-nav');
            // if (orginalZIndex.current) {
            //     setTimeout(() => {
            //         header.style.zIndex = orginalZIndex.current;
            //     }, 200);
            // }
            setTimeout(() => {
                header.removeAttribute('style');
            }, 200);
        }
    }, [connectWalletSignal]);

    return (
        <div className="none-view">
            {!loading && (
                <Fragment>
                    {type === 'noAssets' && (
                        <Fragment>
                            <i className="icon-no-assets" />
                            <p>{intl.formatMessage({ id: 'noAssets' })}</p>
                            <a
                                className="common-btn common-btn-red"
                                onClick={gotoMint}
                            >
                                Lets Mint
                            </a>
                        </Fragment>
                    )}
                    {type === 'noConnection' && (
                        <Fragment>
                            <i className="icon-no-connection" />
                            <p>{intl.formatMessage({ id: 'noConnection' })}</p>
                            <a
                                className="common-btn common-btn-red"
                                onClick={requestConnectWallet}
                            >
                                Connect Wallet
                            </a>
                        </Fragment>
                    )}
                    {type === 'noRecords' && (
                        <Fragment>
                            <i className="icon-no-records" />
                            <p>{intl.formatMessage({ id: 'noTrades' })}</p>
                            <a
                                className="common-btn common-btn-red"
                                onClick={gotoMint}
                            >
                                Lets Mint
                            </a>
                        </Fragment>
                    )}
                </Fragment>
            )}
            {loading && <Loading />}
        </div>
    );
};

export default NoneView;
