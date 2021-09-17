import './less/index.less';

import { Fragment, useContext } from 'react';
import { useModel, useIntl, history } from 'umi';
import { TabRecordBoardContext } from '@/components/TabRecordBoard';
import { useCallback } from 'react';

export type NoneTypes = 'noAssets' | 'noConnection' | 'noRecords' | undefined;
export interface NoneViewProps {
    type: NoneTypes;
}

const NoneView = (props: NoneViewProps) => {
    const { type } = props;
    const intl = useIntl();
    const { close } = useContext(TabRecordBoardContext) ?? {};

    const { requestConnectWallet } = useModel('app', (model) => ({
        requestConnectWallet: model.requestConnectWallet,
    }));

    const gotoMint = useCallback(() => {
        history.push('/mint');
        close && close();
    }, [close]);

    return (
        <div className="none-view">
            {type === 'noAssets' && (
                <Fragment>
                    <i className="icon-no-assets" />
                    <p>{intl.formatMessage({ id: 'noAssets' })}</p>
                    <a className="common-btn common-btn-red" onClick={gotoMint}>
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
                    <a className="common-btn common-btn-red" onClick={gotoMint}>
                        Lets Mint
                    </a>
                </Fragment>
            )}
        </div>
    );
};

export default NoneView;
