import React, { useState } from 'react';
import './index.less';
import { InputNumber, Select, Progress, message, Button } from 'antd';
import IconAdd from '@/assets/images/icon-add.svg';
import { history } from 'umi';
const TOKENS = ['fUSD', 'TSLA'];
export default () => {
    const [token1Balance, setToken1Balance] = useState();
    const [token2Balance, setToken2Balance] = useState();
    const [token1, setToken1] = useState();
    const [token2, setToken2] = useState();
    const [token1Amount, setToken1Amount] = useState();
    const [token2Amount, setToken2Amount] = useState();

    const token1AmountHandler = (v) => {
        setToken1Amount(v);
    };

    const token2AmountHandler = (v) => {
        setToken2Amount(v);
    };

    const token1SelectHandler = (v) => {
        setToken1(v);
    };

    const token2SelectHandler = (v) => {
        setToken2(v);
    };

    return (
        <div className="provide-form common-box">
            <div className="input-item">
                <p className="label">Asset</p>
                <div className="input-item-content">
                    <div className="content-label">
                        <p className="right">
                            Balance:
                            <span className="balance">{token1Balance}</span>
                        </p>
                    </div>
                    <div className="input">
                        <InputNumber
                            value={token1Amount}
                            onChange={token1AmountHandler}
                            placeholder="0.00"
                            className="custom-input"
                        />
                        <div className="token">
                            <Select
                                value={token1}
                                onSelect={token1SelectHandler}
                                placeholder={'Select token'}
                            >
                                {TOKENS.map((item) => (
                                    <Select.Option value={item} key={item}>
                                        {item}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <img src={IconAdd} alt="" className="icon-add" />
           

            <div className="input-item">
                <p className="label">Asset</p>
                <div className="input-item-content">
                    <div className="content-label">
                        <p className="left"></p>
                        <p className="right">
                            Balance:
                            <span className="balance">{token1Balance}</span>
                        </p>
                    </div>
                    <div className="input">
                        <InputNumber
                            disabled // 暂不支持
                            value={token2Amount}
                            onChange={token2AmountHandler}
                            placeholder="0.00"
                            className="custom-input"
                        />
                        <div className="token">
                            <Select
                                value={token2}
                                onSelect={token2SelectHandler}
                                placeholder={'Select token'}
                            >
                                {TOKENS.map((item) => (
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
                <button className="common-btn common-btn-red">Provide</button>
            </div>
        </div>
    );
};
