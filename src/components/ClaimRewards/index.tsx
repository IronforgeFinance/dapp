import './less/index.less';

import { createContext, useCallback, useState, ReactNode } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';
import { history } from 'umi';
import Overlay from '@/components/Overlay';

interface ClaimRewardsContextProps {
    visable: boolean;
    open(): void;
    close(): void;
}

interface ClaimRewardsProps {
    children: ReactNode;
}

export const ClaimRewardsContext =
    createContext<ClaimRewardsContextProps | null>(null);
export const ClaimRewardsContextProvier = ClaimRewardsContext.Provider;

const ClaimRewards = (props: ClaimRewardsProps) => {
    const { children } = props;
    const [visable, setVisable] = useState(false);

    const close = useCallback(() => setVisable(false), []);
    const open = useCallback(() => setVisable(true), []);

    return (
        <ClaimRewardsContext.Provider
            value={{
                visable,
                close,
                open,
            }}
        >
            <Overlay visable={visable}>
                <section className="claim-rewards">
                    <a className="back-btn" onClick={close} />
                    <ul className="cards-group">
                        <li className="rewards card">
                            <div className="before" />
                            <div className="content">
                                <i className="icon-rewards" />
                                <span className="value">$130330</span>
                                <span className="label">rewards</span>
                                <div className="bottom">
                                    <p className="price">
                                        $130003
                                        <i className="icon-question size-20" />
                                    </p>
                                    <Button className="claim-btn common-btn common-btn-red">
                                        Claim
                                    </Button>
                                </div>
                            </div>
                            <div className="after" />
                        </li>
                        <li className="ratio card">
                            <div className="before" />
                            <div className="content">
                                <span className="value">$130330</span>
                                <span className="label">
                                    Earning ratio{' '}
                                    <i className="icon-question size-20" />
                                </span>
                            </div>
                            <div className="after" />
                        </li>
                    </ul>
                </section>
            </Overlay>
            {children}
        </ClaimRewardsContext.Provider>
    );
};

export default ClaimRewards;
