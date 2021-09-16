import './less/index.less';

import React, { useEffect, useState } from 'react';
import IconTwitter from '@/assets/images/twitter.svg';
import IconGithub from '@/assets/images/github.svg';
import IconMedium from '@/assets/images/medium.svg';
import { useGetBnbBalance } from '@/hooks/useTokenBalance';
import TabRecordBoard from '@/components/TabRecordBoard';
import { history } from 'umi';
import MintView from './components/MintView';
import BurnView from './components/BurnView';
import DeliveryView from './components/DeliveryView';
import { useIntl } from 'umi';
import { Button } from 'antd';
import { MDEX_SWAP_EXPLORER } from '@/config/constants/constant';
import { getTokenPrice } from '@/utils/index';
import { ReactComponent as TabBackIcon01 } from '@/assets/images/big-board-svg-01.svg';
import { ReactComponent as TabBackIcon02 } from '@/assets/images/big-board-svg-02.svg';
import { ReactComponent as TabBackIcon03 } from '@/assets/images/big-board-svg-03.svg';

const tabItems = [
    {
        name: 'history.mint',
        key: 'mint',
        icon: <TabBackIcon01 fill="#89512D" />,
    },
    {
        name: 'history.burn',
        key: 'burn',
        icon: <TabBackIcon02 fill="#89512D" />,
    },
    {
        name: 'history.delivery',
        key: 'delivery',
        icon: <TabBackIcon03 fill="#89512D" />,
    },
];

const filterList = ['/', '/trade', '/farm', '/farm/provide', '/wallet'];

const platformToken = 'IFT';

export default () => {
    const intl = useIntl();
    // const { price, rate } = useFtokenPrice();
    const [price, setPrice] = useState(0);
    const [rate, setRate] = useState('0.00%');
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

    // useEffect(() => {
    //     let unmounted = false;
    //     const fetchBalance = async () => {
    //         try {
    //             const dexPrice = await getTokenPrice(platformToken);
    //             setPrice(+dexPrice);
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     };

    //     if (!unmounted) {
    //         fetchBalance();
    //     }

    //     return () => {
    //         unmounted = true;
    //     };
    // }, [fastRefresh]);

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
                            {intl.formatMessage({ id: 'footer.ftoken.price' })}{' '}
                            <span className="rate">{rate}</span>
                        </p>
                    </div>
                    <Button className="btn-buy-token common-btn common-btn-red">
                        <a target="_blank" href={MDEX_SWAP_EXPLORER}>
                            {intl.formatMessage({ id: 'footer.ftoken.button' })}
                        </a>
                    </Button>
                    <div className="medias">
                        <img key={1} src={IconTwitter} />
                        <img key={2} src={IconGithub} />
                        <img key={3} src={IconMedium} />
                    </div>

                    <TabRecordBoard
                        title={intl.formatMessage({ id: 'history' })}
                        tabItems={tabItems.map((item) => ({
                            ...item,
                            name: intl.formatMessage({ id: item.name }),
                        }))}
                        tabKey={tabKey}
                        onChange={(key) => setTabKey(key)}
                        close={() => setVisable(false)}
                        visible={visable}
                        mode="modal"
                    >
                        {CurrentView}
                    </TabRecordBoard>
                </div>
            )}
        </React.Fragment>
    );
};
