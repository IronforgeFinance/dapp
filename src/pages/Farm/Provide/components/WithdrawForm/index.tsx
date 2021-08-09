import React, { useState, useEffect } from 'react';
import { InputNumber, Select } from 'antd';
import IconDown from '@/assets/images/icon-down.svg';
import './index.less';
import { debounce } from 'lodash';
const LP_TOKENS = ['fUSD-fTSLA'];
export default () => {
    const [lpBalance, setLpBalance] = useState();
    const [lp, setLp] = useState();
    const [lpAmount, setLpAmount] = useState();
    const [receiveTokens, setReceiveTokens] = useState([]);
    const lpAmountHandler = (v) => {
        setLpAmount(v);
    };

    useEffect(() => {
        const handleReceiveTokens = debounce(() => {
            if (lp && lpAmount) {
                const tokens = lp.split('-').map((item) => ({
                    token: item,
                    amount: 0.2727,
                }));
                setReceiveTokens(tokens);
            }
        }, 500);
        handleReceiveTokens();
    }, [lpAmount, lp]);

    return (
        <div>
            <div className="provide-form common-box">
                <div className="input-item">
                    <p className="label">LP</p>
                    <div className="input-item-content">
                        <div className="content-label">
                            <p className="right">
                                Balance:
                                <span className="balance">{lpBalance}</span>
                            </p>
                        </div>
                        <div className="input">
                            <InputNumber
                                value={lpAmount}
                                onChange={lpAmountHandler}
                                placeholder="0.00"
                                className="custom-input"
                            />
                            <div className="token">
                                <Select
                                    value={lp}
                                    onSelect={(v) => {
                                        setLp(v);
                                    }}
                                    placeholder={'Select LP'}
                                >
                                    {LP_TOKENS.map((item) => (
                                        <Select.Option value={item} key={item}>
                                            {item}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <img src={IconDown} alt="" className="icon-add" />

                <div className="input-item">
                    <p className="label">You'll Receive</p>
                    <div className="input-item-content receive-tokens">
                        {receiveTokens.map((item) => (
                            <div className="receive-token-item">
                                <p className="token">{item.token}</p>
                                <p className="value">{item.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="btn-footer">
                    <button className="common-btn common-btn-yellow">
                        Withdraw
                    </button>
                </div>
            </div>
            {receiveTokens.length > 0 && (
                <div className="provide-prices">
                    <div>
                        <p className="title">Prices</p>
                        <div className="prices-bg">
                            <div className="price-items">
                                <div className="price-item">
                                    <p className="token">
                                        {receiveTokens[0].token}
                                    </p>
                                    <p className="price">
                                        1.00{receiveTokens[1].token}
                                    </p>
                                </div>
                                <div className="price-item">
                                    <p className="token">
                                        {receiveTokens[1].token}
                                    </p>
                                    <p className="price">
                                        1.00{receiveTokens[0].token}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
