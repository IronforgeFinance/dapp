import { TokenIcon } from '@/components/Icon';
import './index.less';

const PoolView = () => {
    return (
        <div className="pool-view">
            <div className="cols">
                <span className="col-name">Pool</span>
                <span className="col-name">Balance</span>
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
                            <div className="balance data-token-pair-balance">
                                <span className="token0">
                                    <b>0.03</b> ETH
                                </span>
                                <span className="token1">
                                    <b>0.05</b> fUSD
                                </span>
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
                                    Trade
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

export default PoolView;
