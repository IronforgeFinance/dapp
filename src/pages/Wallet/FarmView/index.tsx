import { TokenIcon } from '@/components/Icon';
import './index.less';

const FarmView = () => {
    return (
        <div className="farm-view">
            <div className="cols">
                <span className="col-name">Pool</span>
                <span className="col-name">Staked</span>
                <span className="col-name">Earned</span>
                <span className="col-name">APY</span>
                <span className="col-name">Action</span>
            </div>
            <ul className="rows">
                {new Array(4).fill('').map((record, index) => {
                    return (
                        <li key={index} className="record">
                            <div className="pool data-token-pair">
                                <TokenIcon name="ETH-fUSD" />
                                <span className="name">ETH+fUSD LP</span>
                            </div>
                            <div className="staked data-token-balance">
                                <span className="amount">100</span>
                                <span className="map-dollar">$2100.00</span>
                            </div>
                            <div className="earned data-token-pair-balance">
                                <span className="token0">
                                    <b>0.03</b> ETH
                                </span>
                                <span className="token1">
                                    <b>0.05</b> fUSD
                                </span>
                            </div>
                            <span className="apy data-normal">40%</span>
                            <div className="action">
                                <button className="common-btn common-btn-red">
                                    Provide
                                </button>
                                <button className="common-btn common-btn-yellow">
                                    Withdraw
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default FarmView;
