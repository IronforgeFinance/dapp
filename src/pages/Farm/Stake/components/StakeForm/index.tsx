import React, { useState } from 'react';
import { InputNumber, Select, Progress, Button } from 'antd';
import * as message from '@/components/Notification';
import './index.less';
const LP_TOKENS = ['fUSD-FTSLA'];
import { STAKE_TABS } from '../../index';
import { TokenIcon } from '@/components/Icon';
import SelectTokens from '@/components/SelectTokens';
export default (props: { tabKey: string }) => {
    const { tabKey } = props;
    const [lpBalance, setLpBalance] = useState();
    const [lpAmount, setLpAmount] = useState();
    const [lp, setLp] = useState();
    const [showSelectToToken, setShowSelectToToken] = useState(false);
    const [token, setToken] = useState('');
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
                            <TokenIcon
                                name={String(token).toLowerCase()}
                                size={24}
                            />
                            <SelectTokens
                                visable={showSelectToToken}
                                value={token}
                                tokenList={LP_TOKENS.map((name) => ({ name }))}
                                onSelect={(v) => setToken(v)}
                                onClose={() => setShowSelectToToken(false)}
                            >
                                <button
                                    onClick={() => setShowSelectToToken(true)}
                                    className="select-token-btn"
                                >
                                    <span>
                                        {token || <span>Select token</span>}
                                    </span>
                                    <i className="icon-down size-20"></i>
                                </button>
                            </SelectTokens>
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
