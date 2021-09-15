import './less/index.less';

import { Fragment } from 'react';
import { useModel } from 'umi';

interface NoneView {
    type: 'noAssets' | 'noConnection' | 'noRecords' | undefined;
}

const NoneView = (props: NoneView) => {
    const { type } = props;

    const { requestConnectWallet } = useModel('app', (model) => ({
        requestConnectWallet: model.requestConnectWallet,
    }));

    return (
        <div className="none-view">
            {type === 'noAssets' && (
                <Fragment>
                    <i className="icon-no-assets" />
                    <p>Don't have any assets</p>
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
                    <p>您还没有连接钱包，请先连接钱包</p>
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
                    <p>暂无历史记录，请先去铸造？</p>
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
