import React from 'react';
import './index.less';
import IconTwitter from '@/assets/images/twitter.svg';
import IconGithub from '@/assets/images/github.svg';
import IconMedium from '@/assets/images/medium.svg';
import { useFtokenPrice, useGetBnbBalance } from '@/hooks/useTokenBalance';
import DataBoard from './DataBoard';
import { history } from 'umi';
import MintView from './components/MintView';
import BurnView from './components/BurnView';
import DeliveryView from './components/DeliveryView';

const tabItems = [
    {
        name: 'Mint',
        key: 'mint',
    },
    {
        name: 'Burn',
        key: 'burn',
    },
    {
        name: 'Delivery',
        key: 'delivery',
    },
];

const filterList = ['/', '/farm'];

export default () => {
    const { price, rate } = useFtokenPrice();
    const { balance } = useGetBnbBalance();
    const [tabKey, setTabKey] = React.useState(tabItems[0].key);
    const [visable, setVisable] = React.useState(false);
    const [showWholeView, setShowWholeView] = React.useState(false);

    const CurrentView = React.useMemo(() => {
        switch (tabKey) {
            case tabItems[0].key: {
                return <MintView />;
            }
            case tabItems[1].key: {
                return <BurnView />;
            }
            case tabItems[2].key: {
                return <DeliveryView />;
            }
            default:
                return null;
        }
    }, [tabKey]);

    React.useEffect(() => {
        setShowWholeView(
            !filterList.some((item) => item === window.location!.pathname),
        );

        return history.listen((location, action) => {
            setShowWholeView(
                !filterList.some((item) => item === location.pathname),
            );
        });
    }, []);

    const openHistory = React.useCallback(() => {
        setVisable(true);
        setTabKey(tabItems[2].key);
    }, []);

    const openMint = React.useCallback(() => {
        setVisable(true);
        setTabKey(tabItems[0].key);
    }, []);

    return (
        <React.Fragment>
            {showWholeView && (
                <div className="footer-container">
                    <div className="entries">
                        <button className="btn-history" onClick={openMint} />
                        <button className="btn-52days" onClick={openHistory} />
                    </div>
                    <div className="ftoken">
                        <p className="price">
                            <span className="symbol">$</span>
                            {price}
                        </p>
                        <p className="label">
                            fToken Price <span className="rate">{rate}</span>
                        </p>
                    </div>
                    <button className="btn-buy-token common-btn common-btn-red">
                        Buy Token
                    </button>
                    {/* <p className="balance">Balance: {balance}</p> */}
                    <div className="medias">
                        <img key={1} src={IconTwitter} />
                        <img key={2} src={IconGithub} />
                        <img key={3} src={IconMedium} />
                    </div>

                    <DataBoard
                        // title={tabKey.replace(/^([\w]{1})/, (v) =>
                        //     v.toUpperCase(),
                        // )}
                        title="History"
                        tabItems={tabItems}
                        tabKey={tabKey}
                        onChange={(key) => setTabKey(key)}
                        onClose={() => setVisable(false)}
                        visable={visable}
                    >
                        {CurrentView}
                    </DataBoard>
                </div>
            )}
        </React.Fragment>
    );
};
