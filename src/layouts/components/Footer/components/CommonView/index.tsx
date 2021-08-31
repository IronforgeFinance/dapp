import './index.less';

import { Fragment, ReactNode, useMemo } from 'react';
import { getRemainDaysOfQuarterAsset } from '@/utils';
import { TokenIcon } from '@/components/Icon';
import { ethers } from 'ethers';
import { Popover } from 'antd';

/**
 * @todo PoolView、FarmView、HistoryView后面拆出去，属于wallet这边的组件
 * @todo 写的有点乱，Record类型应该用范型来解决，后面重构的时候再搞
 */
export type HistoryType = 'Mint' | 'Burn' | 'Trade' | 'Pool' | 'Farm';
export type VerbType =
    | 'From'
    | 'Send'
    | 'Provide Liquidity'
    | 'Withdraw Liquidity'
    | 'Stake LP';
export type ConjType = 'To' | 'and' | '';
export type IconType =
    | 'mint'
    | 'burn'
    | 'trade'
    | 'pool-burn'
    | 'pool-mint'
    | 'farm';
export type ActionBtnColors = 'yellow' | 'red';
interface ActionProps {
    title: string;
    color?: ActionBtnColors;
    onClick?(): void;
}

interface ValueProps {
    amount: string | number;
    price: string | number;
}

interface TokenProps {
    name: string;
    amount: string | number;
}

export interface PoolViewProps {
    id?: number | string; //key
    token0?: TokenProps;
    token1?: TokenProps;
    earnedToken0?: TokenProps;
    earnedToken1?: TokenProps;
    apy?: string | number;
    actions?: ActionProps[];
}
export interface FarmViewProps {
    id?: number | string; //key
    value?: ValueProps;
    token0?: TokenProps;
    token1?: TokenProps;
    earnedToken0?: TokenProps;
    earnedToken1?: TokenProps;
    apy?: string | number;
}
export interface HistoryViewProps {
    id?: number | string; //key
    icon?: IconType;
    type?: HistoryType;
    verb?: VerbType;
    conj?: ConjType;
    token0?: TokenProps;
    token1?: TokenProps;
    link?: string;
    dealtime?: string | number;
}

interface MintViewProps {
    id?: string | number;
    user?: string;
    ratio?: string | number;
    txhash?: string;
    timestamp?: string | number;
    collateralCurrency?: string;
    collateralAmount?: string | number;
    lockedAmount?: string | number;
    mintedCurrency?: string;
    mintedAmount?: string | number;
}

interface BurnViewProps {
    id?: string | number;
    user?: string;
    ratio?: string | number;
    txhash?: string;
    timestamp?: string | number;
    unstakingCurrency?: string;
    unstakingAmount?: string | number;
    unlockedAmount?: string | number;
    cleanedDebt?: string | number;
}

export interface RecordProps
    extends MintViewProps,
        BurnViewProps,
        PoolViewProps,
        FarmViewProps,
        HistoryViewProps {
    // extend props
    noToken?: boolean;
    noPrice?: boolean;
    currency?: string;
    amount?: string | number;
    deliveryCurrency?: string;
    customData?: string;
    actions?: ActionProps[];
}

const Br = () => <div dangerouslySetInnerHTML={{ __html: '<br/>' }} />;

export const ActionView = (props: RecordProps) => {
    const { actions = [] } = props;

    return (
        <div className="action-view">
            {actions.map((action) => (
                <button
                    key={action.title}
                    className={`common-btn common-btn-${
                        action.color || ('red' as ActionBtnColors)
                    }`}
                >
                    {action.title}
                </button>
            ))}
        </div>
    );
};

export const LpTokenView = (props: RecordProps) => {
    const { token0, token1 } = props;

    return (
        <div className="lp-token-view">
            <TokenIcon name={`${token0.name}-${token1.name}`} />
            <span className="name">{`${token0.name}+${token1.name}`} LP</span>
        </div>
    );
};

export const BalanceView = (props: RecordProps) => {
    const { token0, token1 } = props;

    return (
        <div className="balance-view">
            <span className="token0">
                <b>{token0.amount}</b> {token0.name}
            </span>
            <span className="token1">
                <b>{token1.amount}</b> {token1.name}
            </span>
        </div>
    );
};

export const PriceView = (props: RecordProps) => {
    const { value } = props;

    return (
        <div className="price-view">
            <span className="amount">{value.amount}</span>
            <span className="price">{value.price}</span>
        </div>
    );
};

export const TokenView = (props: RecordProps) => {
    const { noToken, noPrice, amount, currency } = props;

    const longToken = useMemo(
        () => currency.split('-')?.length > 1 ?? false,
        [currency],
    );

    return (
        <div className="token-view">
            <div className="head">
                {!(noToken ?? false) && <TokenIcon name={currency} />}
                {!longToken && (
                    <Fragment>
                        <b className="amount">
                            {ethers.utils.formatUnits(amount, 18)}
                        </b>
                        <span className="currency">{currency}</span>
                    </Fragment>
                )}
                {longToken && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <b className="amount">
                            {ethers.utils.formatUnits(amount, 18)}
                        </b>
                        <span className="currency">{currency}</span>
                    </div>
                )}
            </div>
            <div
                className="bottom"
                style={{
                    visibility: noPrice ?? false ? 'hidden' : 'unset',
                }}
            >
                {!(noToken ?? false) && <TokenIcon name={currency} />}
                <span className="currency">$</span>
                <span className="price">--</span>
            </div>
        </div>
    );
};

export const PureView = (props: RecordProps) => {
    const { customData } = props;

    return <span className="pure-view">{customData}</span>;
};

export const TypeView = (props: RecordProps) => {
    const { currency } = props;

    const isDelivery = useMemo(
        // Delivery Sample: LBTC-20170207
        () => /^.+(-\d+)$/.test(currency),
        [currency],
    );

    const restDays = useMemo(
        () => getRemainDaysOfQuarterAsset(currency.split('-')[1]),
        [currency],
    );

    return (
        <div className="type-view">
            {isDelivery && (
                <div className="delivery">
                    <span className="name">Delivery</span>
                    <div className="rest-days">
                        <p className="time">
                            {restDays}
                            <span>Days</span>
                        </p>
                        <Popover
                            placement="top"
                            trigger="hover"
                            content="......"
                        >
                            <i className="icon-question size-16" />
                        </Popover>
                    </div>
                </div>
            )}
            {!isDelivery && <PureView customData="Perpetual" />}
        </div>
    );
};

type DebtStatus = 'Active' | 'Static';

export const DebtView = (props: RecordProps) => {
    const { currency, deliveryCurrency, amount } = props;

    const restDays = useMemo(
        () => getRemainDaysOfQuarterAsset(currency.split('-')[1]),
        [currency],
    );

    const status: DebtStatus = useMemo(
        () => (restDays > 0 ? 'Active' : 'Static'),
        [restDays],
    );

    const background = useMemo(
        () => (status === 'Active' ? '#6F4123' : '#460D12'),
        [status],
    );

    return (
        <div className="type-view">
            <div className="delivery">
                <div className="token">
                    <b className="amount">
                        {ethers.utils.formatUnits(amount, 18)}
                    </b>
                    <span className="currency">{deliveryCurrency}</span>
                </div>
                <div className="rest-days">
                    <span className="status" style={{ background }}>
                        {status}
                    </span>
                    <Popover placement="top" trigger="hover" content="......">
                        <i className="icon-question size-16" />
                    </Popover>
                </div>
            </div>
        </div>
    );
};

export const TimeView = (props: RecordProps) => {
    const { timestamp } = props;

    const date = useMemo(() => new Date(+timestamp * 1000), [timestamp]);

    return (
        <time className="time-view">
            <PureView customData={date.toDateString()} />
            <PureView customData={date.toLocaleTimeString()} />
        </time>
    );
};
