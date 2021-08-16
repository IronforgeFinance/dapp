import React from 'react';
import './index.less';
import { CurrencySymbol } from '@/config/constants/types';
import classNames from 'classnames';

// type DataType = 'address' | 'mouney';

interface Price {
    amount: string | number;
    symbol?: CurrencySymbol;
}

interface Address {
    address: string;
}

interface DetailData<T> {
    label: string;
    value: T;
}

function instanceOfAddress(object: any): object is Address {
    return 'address' in object;
}

function instanceOfPrice(object: any): object is Price {
    return 'amount' in object;
}

interface MarketDetailProps {
    token0: string;
    token1: string;
    dataSource: DetailData<Address | Price>[];
}

const DEFAULT_CURRENCY_SYMBOL: CurrencySymbol = '$';

const MarketDetail = (props: MarketDetailProps) => {
    const [toggle, setToggle] = React.useState(false);

    return (
        <div
            className={classNames({
                'market-details': true,
                hide: toggle,
                show: !toggle,
            })}
        >
            <button className="btn-skip" onClick={() => setToggle(!toggle)} />
            <div className="head">
                <p className="details">
                    Market Details:{' '}
                    <span className="token-pair">
                        {props.token0}/{props.token1}
                    </span>
                </p>
                <span className="token0">{props.token0}</span>
            </div>
            <div className="main">
                <ul className="props">
                    {props.dataSource.map((prop) => {
                        return (
                            <li className="prop">
                                <span className="label">{prop.label}</span>
                                {instanceOfAddress(prop.value) && (
                                    <span className="value address">
                                        {prop.value.address.replace(
                                            /^(0x[\d\w]{4}).*([\d\w]{4})$/,
                                            '$1...$2',
                                        )}
                                    </span>
                                )}
                                {instanceOfPrice(prop.value) && (
                                    <span className="value price">
                                        {prop.value.symbol ||
                                            DEFAULT_CURRENCY_SYMBOL}
                                        {prop.value.amount}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default MarketDetail;
