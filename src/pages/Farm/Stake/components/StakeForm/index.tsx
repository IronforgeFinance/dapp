import React, { useState } from 'react';
import { InputNumber, Select, Progress, message, Button } from 'antd';
import './index.less';
const LP_TOKENS = ['fUSD-FTSLA'];
import { STAKE_TABS } from '../../index';
export default (props: { tabKey: string }) => {
    const { tabKey } = props;
    const [lpBalance, setLpBalance] = useState();
    const [lpAmount, setLpAmount] = useState();
    const [lp, setLp] = useState();
    return (
        <div className="provide-form common-box">
            <div className="input-item">
                <p className="label">Asset</p>
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
                            onChange={(v) => {
                                setLpAmount(v);
                            }}
                            placeholder="0.00"
                            className="custom-input"
                        />
                        <div className="token">
                            <Select
                                value={lp}
                                onSelect={(v) => {
                                    setLp(v);
                                }}
                                placeholder={'Select token'}
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

            <div className="btn-footer">
                <button className="common-btn common-btn-red">
                    {tabKey === STAKE_TABS.stake ? 'Stake' : 'Unstake'}
                </button>
            </div>
            {lp && tabKey === STAKE_TABS.stake && (
                <div className="info-footer">
                    <p className="tips">Don't have {lp}?</p>
                    <p className="link">
                        Get {lp} LP <span></span>{' '}
                    </p>
                </div>
            )}
        </div>
    );
};
