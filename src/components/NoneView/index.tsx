import './less/index.less';

import { Fragment } from 'react';
import { useModel, useIntl } from 'umi';

export type NoneTypes = 'noAssets' | 'noConnection' | 'noRecords' | undefined;
export interface NoneViewProps {
    type: NoneTypes;
}

const NoneView = (props: NoneViewProps) => {
    const { type } = props;
    const intl = useIntl();

    const { requestConnectWallet } = useModel('app', (model) => ({
        requestConnectWallet: model.requestConnectWallet,
    }));

    return (
        <div className="none-view">
            {type === 'noAssets' && (
                <Fragment>
                    <i className="icon-no-assets" />
                    <p>{intl.formatMessage({ id: 'noAssets' })}</p>
                    <a
                        className="common-btn common-btn-red"
                        target="_self"
                        href="/mint"
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
                        target="_self"
                        href="/mint"
                    >
                        Lets Mint
                    </a>
                </Fragment>
            )}
        </div>
    );
};

export default NoneView;
