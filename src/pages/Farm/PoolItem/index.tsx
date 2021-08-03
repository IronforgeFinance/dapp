import React from 'react';
import './index.less';
import { history } from 'umi';
interface IPoolItem {
    lp: string;
    apy: string;
    totalStaked: number;
    earnedToken: string;
    earnedAmount: number;
    staked: number;
}
export default (props: IPoolItem) => {
    const { lp, apy, totalStaked, earnedAmount, earnedToken, staked } = props;
    const [token1, token2] = lp.split('-');
    return (
        <div className="pool-item">
            <div className={`lp-token lp-token-left`}>
                <div className={`lp-token-${token1}`}></div>
            </div>
            <div className={`lp-token lp-token-right`}>
                <div className={`lp-token-${token2}`}></div>
            </div>
            <div className="pool-item-container">
                <div className="pool-item-title">
                    <p>{lp}</p>
                </div>
                <div className="total-info">
                    <div className="total-info-item">
                        <p className="label">APY</p>
                        <p className="value">{apy}</p>
                    </div>
                    <div className="total-info-item">
                        <p className="label">Total staked</p>
                        <p className="value">{totalStaked}</p>
                    </div>
                </div>

                <div className="user-info">
                    <div className="user-info-item">
                        <p className="label">{earnedToken} EARNED</p>
                        <div className="value">
                            <p>{earnedAmount}</p>
                            <button className="common-btn common-btn-yellow common-btn-s">
                                Harvest
                            </button>
                        </div>
                    </div>
                    <div className="user-info-item">
                        <p className="label">{lp} STAKED</p>
                        <div className="value">
                            <p>{staked}</p>
                            <button
                                className="common-btn common-btn-red common-btn-s"
                                onClick={() => {
                                    history.push('/farm/stake');
                                }}
                            >
                                Stake LP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
