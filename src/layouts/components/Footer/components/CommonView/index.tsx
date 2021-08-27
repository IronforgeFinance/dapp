import './index.less';

import { Fragment, useMemo } from 'react';
import { getRemainDaysOfQuarterAsset } from '@/utils';
import { TokenIcon } from '@/components/Icon';
import { ethers } from 'ethers';
import { Popover } from 'antd';

interface MintViewProps {
    collateralCurrency?: string;
    collateralAmount?: string | number;
    lockedAmount?: string | number;
    mintedCurrency?: string;
    mintedAmount?: string | number;
}

interface BurnViewProps {
    unstakingCurrency?: string;
    unstakingAmount?: string | number;
    unlockedAmount?: string | number;
    cleanedDebt?: string | number;
}

export interface RecordProps extends MintViewProps, BurnViewProps {
    // common original data
    id?: string | number;
    user?: string;
    ratio?: string | number;
    txhash?: string;
    timestamp?: string | number;

    // extend props
    noToken?: boolean;
    noPrice?: boolean;
    currency?: string;
    amount?: string | number;
    deliveryCurrency?: string;
    customData?: string;
}

const Br = () => <div dangerouslySetInnerHTML={{ __html: '<br/>' }} />;

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

type DebtStatusTypes = 'Active' | 'Static';

export const DebtView = (props: RecordProps) => {
    const { currency, deliveryCurrency, amount } = props;

    const restDays = useMemo(
        () => getRemainDaysOfQuarterAsset(currency.split('-')[1]),
        [currency],
    );

    const status: DebtStatusTypes = useMemo(
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
