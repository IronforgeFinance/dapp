import './pc.less';
import './mobile.less';

import { TokenIcon } from '@/components/Icon';

const HoldingView = () => {
    return (
        <div className="holding-view">
            <div className="holding-total-value">
                <p className="wrapper">
                    <span className="label">Total Holding Value</span>
                    <span className="amount">6,392 fUSD</span>
                </p>
            </div>
            <div className="cols">
                <span className="col-name">Asset</span>
                <span className="col-name">Price</span>
                <span className="col-name">Balance</span>
                <span className="col-name">Route</span>
                <span className="col-name">Ratio</span>
                <span className="col-name">Action</span>
            </div>
            <ul className="rows">
                {new Array(4).fill('').map((record, index) => {
                    return (
                        <li key={index} className="record">
                            <div className="asset data-normal">
                                <TokenIcon
                                    name="fUSD"
                                    size={28}
                                    style={{ marginRight: '6px' }}
                                />
                                <span>fUSD</span>
                            </div>
                            <span className="price data-normal bold">
                                $2100.00
                            </span>
                            <div className="balance data-token-balance">
                                <span className="amount">100</span>
                                <span className="map-dollar">$2100.00</span>
                            </div>
                            <div className="rount data-normal">Mint</div>
                            <span className="ratio data-normal">40%</span>
                            <div className="action">
                                <button className="common-btn common-btn-red">
                                    Trade
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default HoldingView;
