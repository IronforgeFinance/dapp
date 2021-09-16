import './less/index.less';

import { createContext, useCallback, useState, ReactNode } from 'react';
import { Button, Popover } from 'antd';
import Overlay from '@/components/Overlay';
import { useWeb3React } from '@web3-react/core';

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
    const { account } = useWeb3React();

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
                                <span className="value">
                                    {account ? `$${0}` : '--'}
                                </span>
                                <span className="label">rewards</span>
                                <div className="bottom">
                                    <p className="price">
                                        {account ? `$${0}` : '--'}
                                        <Popover
                                            trigger="hover"
                                            placement="topLeft"
                                            content="收益来自于铸造中锁仓的BS，50%可即刻提取，50%将于30天内线性释放。"
                                        >
                                            <i className="icon-question size-20" />
                                        </Popover>
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
                                <span className="value">
                                    {account ? `${0}%` : '--'}
                                </span>
                                <span className="label">
                                    Earning ratio{' '}
                                    <Popover
                                        trigger="hover"
                                        placement="topRight"
                                        content="收益/锁仓"
                                    >
                                        <i className="icon-question size-20" />
                                    </Popover>
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
