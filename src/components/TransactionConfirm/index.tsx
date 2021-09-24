import './pc.less';
import './mobile.less';

import {
    useCallback,
    useState,
    createContext,
    ReactNode,
    useMemo,
} from 'react';
import ScrollBoard from '@/components/ScrollBoard';
import { Button } from 'antd';
import { TokenIcon } from '../Icon';
import { useRef } from 'react';
import { loading } from '../Notification';

export type ViewType = 'mint' | 'burn' | 'loading' | 'trade';

interface TokenProps {
    name: string;
    price: number;
    amount: number;
}

interface ViewOptions {
    placeholder?: string;
    view: ViewType;
    fromToken: TokenProps;
    toToken: TokenProps;
    bsToken?: TokenProps;
    type: 'Delivery' | 'Perpetuation';
}

interface OpenOptions extends ViewOptions {
    confirm?(): void;
    final?(boolean?): void;
}

interface TransitionConfirmContextProps {
    visible: boolean;
    open(OpenOptions): void;
    close(): void;
    setVisible(boolean): void;
}

export const TransitionConfirmContext =
    createContext<TransitionConfirmContextProps | null>(null);

interface TransitionConfirmProps {
    children: ReactNode;
}

export default (props: TransitionConfirmProps) => {
    const { children } = props;
    const [visible, setVisible] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [approved, setApproved] = useState(false);
    const openOption = useRef<OpenOptions>(null);
    const [view, setView] = useState<OpenOptions>(null);
    const [isBurn, setIsBurn] = useState(false);

    const open = useCallback((options: OpenOptions) => {
        openOption.current = options;
        setView(options);
        setVisible(true);
    }, []);

    const close = useCallback(() => {
        openOption?.current?.final(false);
        setVisible(false);
    }, []);

    const approve = useCallback(() => setApproved(true), []);

    const submit = useCallback(async () => {
        try {
            setIsConfirming(true);

            /**@description change to loading view */
            setView({ ...view, view: 'loading' });

            /**@description hide and show notification message after 3 secs */
            // let closeLoading = () => {};
            // setTimeout(() => {
            //     setVisible(false);
            //     closeLoading = loading({
            //         message: 'Waiting for Transaction Submitted...',
            //         description: `Mint ${view.fromToken.name} from ${view.toToken.name}`,
            //         scale: () => setVisible(true),
            //     });
            // }, 3000);

            /**@description if over 10 mins, it'll show revert operation */
            // const tenMins = 1000 * 60 * 10;
            // const afterOverTenMins = new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         closeLoading = loading({
            //             message: 'Waiting for Transaction Submitted...',
            //             description: `Mint ${view.fromToken.name} from ${view.toToken.name}`,
            //             scale: () => setVisible(true),
            //             revert: () => {
            //                 /**@todo rollback oepration */
            //             },
            //         });

            //         reject();
            //     }, tenMins);
            // });

            // await Promise.race([afterOverTenMins, openOption.current?.confirm]);
            await openOption.current?.confirm();

            // closeLoading();
            setIsConfirming(false);
            close();
            openOption?.current?.final(true);
        } catch (error) {
            console.error(error);
            setIsConfirming(false);
            openOption.current?.final(false);
        }
    }, [view]);

    const CurrentView = useMemo(() => {
        switch (view?.view) {
            case 'mint': {
                setIsBurn(false);
                return (
                    <section className="i-mint-view">
                        <div className="token from">
                            <div className="left">
                                <span>
                                    <TokenIcon
                                        name={view.fromToken.name}
                                        size={24}
                                    />
                                    {view.fromToken.name}
                                </span>
                                <span>Collateral</span>
                            </div>
                            <div className="right">
                                <span>{view.fromToken.amount}</span>
                                <span>${view.fromToken.price}</span>
                            </div>
                        </div>
                        <i className="icon-arrow-down" />
                        <div className="token to">
                            <div className="left">
                                <span>
                                    <TokenIcon
                                        name={view.toToken.name}
                                        size={24}
                                    />
                                    {view.toToken.name}
                                </span>
                                <span>Mint</span>
                            </div>
                            <div className="right">
                                <span>{view.toToken.amount}</span>
                                <span>${view.toToken.price}</span>
                            </div>
                        </div>
                        {!approved && (
                            <div className="price-updated">
                                <i className="icon-question size-16" />
                                <span>Price Updated</span>
                                <Button
                                    className="accept-btn common-btn common-btn-red"
                                    onClick={approve}
                                >
                                    Accept
                                </Button>
                            </div>
                        )}
                        <p className="tip">
                            Output is estimated.You will receive at least{' '}
                            <b>{view.toToken.amount} fUSD</b> or the transaction
                            will <span className="red">revert</span>.
                        </p>
                        <div className="token bs">
                            <div className="left">
                                <span>
                                    <TokenIcon
                                        name={view.bsToken.name}
                                        size={24}
                                    />
                                    {view.bsToken.name}
                                </span>
                                <span>Locked</span>
                            </div>
                            <div className="right">
                                <span>{view.bsToken.amount}</span>
                                <span>${view.bsToken.price}</span>
                            </div>
                        </div>
                        <div className="type">
                            <div className="left">
                                <span>Type</span>
                            </div>
                            <div className="right">
                                <span>Delivery</span>
                            </div>
                        </div>
                        <ul className="total" style={{ display: 'none' }}>
                            <li>
                                <span className="label">Price</span>
                                <span className="value">
                                    0.2fUSD/USDC <i className="loading" />
                                </span>
                            </li>
                            <li>
                                <span className="label">Minimum received</span>
                                <span className="value">0.2fUSD</span>
                            </li>
                            <li>
                                <span className="label">Fee cost</span>
                                <span className="value">0.2USDC</span>
                            </li>
                        </ul>
                        {approved && (
                            <Button
                                className="confirm-btn common-btn common-btn-red"
                                loading={isConfirming}
                                onClick={submit}
                            >
                                Confirm Transaction
                            </Button>
                        )}
                    </section>
                );
            }
            case 'trade': {
                setIsBurn(true);
                return (
                    <section className="i-trade-view">
                        <div className="token from">
                            <div className="left">
                                <span>
                                    <TokenIcon
                                        name={view.fromToken.name}
                                        size={24}
                                    />
                                    {view.fromToken.name}
                                </span>
                                <span>From</span>
                            </div>
                            <div className="right">
                                <span>{view.fromToken.amount}</span>
                                {view.toToken.price && (
                                    <span>${view.fromToken.price}</span>
                                )}
                            </div>
                        </div>
                        <i className="icon-arrow-down" />
                        <div className="token to">
                            <div className="left">
                                <span>
                                    <TokenIcon
                                        name={view.toToken.name}
                                        size={24}
                                    />
                                    {view.toToken.name}
                                </span>
                                <span>To</span>
                            </div>
                            <div className="right">
                                <span>{view.toToken.amount}</span>
                                {view.toToken.price && (
                                    <span>${view.toToken.price}</span>
                                )}
                            </div>
                        </div>
                        <Button
                            className="confirm-btn common-btn common-btn-red"
                            loading={isConfirming}
                            onClick={submit}
                        >
                            Confirm Transaction
                        </Button>
                    </section>
                );
            }
            case 'burn': {
                setIsBurn(true);
                return (
                    <section className="i-burn-view">
                        <div className="token from">
                            <div className="left">
                                <span>
                                    <TokenIcon
                                        name={view.fromToken.name}
                                        size={24}
                                    />
                                    {view.fromToken.name}
                                </span>
                                <span>Burn</span>
                            </div>
                            <div className="right">
                                <span>{view.fromToken.amount}</span>
                                <span>${view.fromToken.price}</span>
                            </div>
                        </div>
                        <i className="icon-arrow-down" />
                        <div className="token to">
                            <div className="left">
                                <span>
                                    <TokenIcon
                                        name={view.toToken.name}
                                        size={24}
                                    />
                                    {view.toToken.name}
                                </span>
                                <span>Unstaking</span>
                            </div>
                            <div className="right">
                                <span>{view.toToken.amount}</span>
                                <span>${view.toToken.price}</span>
                            </div>
                        </div>
                        <div className="token bs">
                            <div className="left">
                                <span>
                                    <TokenIcon
                                        name={view.bsToken.name}
                                        size={24}
                                    />
                                    {view.bsToken.name}
                                </span>
                                <span>Unlocked</span>
                            </div>
                            <div className="right">
                                <span>{view.bsToken.amount}</span>
                                <span>${view.bsToken.price}</span>
                            </div>
                        </div>
                        <div className="type">
                            <div className="left">
                                <span>Type</span>
                            </div>
                            <div className="right">
                                <span>Delivery</span>
                            </div>
                        </div>
                        <Button
                            className="confirm-btn common-btn common-btn-red"
                            loading={isConfirming}
                            onClick={submit}
                        >
                            Confirm Transaction
                        </Button>
                    </section>
                );
            }
            case 'loading': {
                return (
                    <section className="i-loading-view">
                        <i className="transaction-confirm-loading" />
                        <div className="details">
                            <p className="summary">
                                Waiting for Transaction Submitted...
                            </p>
                            <p>
                                {isBurn ? 'Unstaking' : 'Staking'}{' '}
                                <span>{view.fromToken.amount}</span>{' '}
                                {view.fromToken.name} and{' '}
                                {isBurn ? 'Burn' : 'Mint'}{' '}
                                <span>{view.toToken.amount}</span>{' '}
                                {view.toToken.name}
                            </p>
                            <div className="q">
                                <p>
                                    Once you place the transaction, they will be
                                    displayed here or history. Live transaction
                                    can be edited or cancelled.
                                </p>
                                <div>
                                    Status:<span>Pending</span>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            }
        }
    }, [view, approved, isBurn]);

    return (
        <TransitionConfirmContext.Provider
            value={{
                open,
                close,
                visible,
                setVisible,
            }}
        >
            <ScrollBoard
                visable={visible}
                onClose={() => close()}
                title="Confirm Transaction"
            >
                {CurrentView}
            </ScrollBoard>
            {children}
        </TransitionConfirmContext.Provider>
    );
};
