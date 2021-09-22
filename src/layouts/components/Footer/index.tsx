import './less/index.less';

import {
    useEffect,
    useState,
    useMemo,
    useContext,
    Fragment,
    useCallback,
} from 'react';
import IconTwitter from '@/assets/images/twitter.svg';
import IconGithub from '@/assets/images/github.svg';
import IconMedium from '@/assets/images/medium.svg';
import { history } from 'umi';
import { useIntl } from 'umi';
import { Button } from 'antd';
import { MDEX_SWAP_EXPLORER } from '@/config/constants/constant';
import { TokenIcon } from '@/components/Icon';
import useEnv from '@/hooks/useEnv';
import { HistoryBoardContext } from '@/components/HistoryBoard/HistoryBoardContextProvider';
import { MobileNavigationContext } from '@/layouts/components/Header/components/MobileNavigation/MobileNavigationProvider';

export default () => {
    const intl = useIntl();
    const [price] = useState(0);
    const { openWithTabKey } = useContext(HistoryBoardContext);
    const { setVisible: setMobileNavigationVisible } = useContext(
        MobileNavigationContext,
    );
    const isMobile = useEnv();
    const [rate] = useState('0.00%');
    const [showWholeView, setShowWholeView] = useState(false);

    const filterList = useMemo(
        () =>
            isMobile
                ? []
                : ['/', '/trade', '/farm', '/farm/provide', '/wallet'],
        [isMobile],
    );

    useEffect(() => {
        setShowWholeView(
            !filterList.some((item) => item === window.location!.pathname),
        );

        return history.listen((location, action) => {
            setShowWholeView(
                !filterList.some((item) => item === location.pathname),
            );
        });
    }, [filterList]);

    const openHistory = useCallback(() => {
        openWithTabKey(2);
        setMobileNavigationVisible(false);
    }, []);
    const openMint = useCallback(() => {
        openWithTabKey();
        setMobileNavigationVisible(false);
    }, []);

    return (
        <Fragment>
            {showWholeView && (
                <div className="footer-container">
                    <div className="entries">
                        <button className="btn-history" onClick={openMint} />
                        <button className="btn-52days" onClick={openHistory} />
                    </div>
                    <div className="ftoken">
                        <p className="price">
                            <TokenIcon name="bs" />
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
                </div>
            )}
        </Fragment>
    );
};
