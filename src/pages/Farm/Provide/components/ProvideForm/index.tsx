import React, { useState } from 'react';
import './index.less';
import { InputNumber, Select, Progress, message, Button } from 'antd';
import IconAdd from '@/assets/images/icon-add.svg';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import { useModel } from 'umi';
const LP_TOKENS = ['USDC-ETH', 'USDC-IFT']; //TODO 配置中读取官方预先添加的流动性lp
const TOKENS = Array.from(
    new Set(
        LP_TOKENS.map((item) => item.split('-')).reduce(
            (arr, item) => arr.concat(item),
            [],
        ),
    ),
);
export default () => {
    // const [token1Balance, setToken1Balance] = useState();
    // const [token2Balance, setToken2Balance] = useState();
    const [token1, setToken1] = useState<string>();
    const [token2, setToken2] = useState<string>();
    const [token1Amount, setToken1Amount] = useState();
    const [token2Amount, setToken2Amount] = useState();
    const { lpDataList, setLpDataList, fetchLpDataInfo } = useModel(
        'lpData',
        (model) => ({ ...model }),
    );

    fetchLpDataInfo('USDC-IFT');
    const { balance: token1Balance } = useBep20Balance(token1);
    const { balance: token2Balance } = useBep20Balance(token2);

    const token1AmountHandler = (v) => {
        setToken1Amount(v);
    };

    const token2AmountHandler = (v) => {
        setToken2Amount(v);
    };

    const token1SelectHandler = (v) => {
        if (token2 === v) {
            setToken2(token1);
            setToken1(v);
        } else {
            setToken1(v);
        }
    };

    const token2SelectHandler = (v) => {
        if (token1 === v) {
            setToken1(token2);
            setToken2(v);
        } else {
            setToken2(v);
        }
    };

    return (
        <div>
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
                                <span className="balance">{token2Balance}</span>
                            </p>
                        </div>
                        <div className="input">
                            <InputNumber
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
                    <button className="common-btn common-btn-red">
                        Provide
                    </button>
                </div>
            </div>
            {token1 && token2 && (
                <div className="provide-prices">
                    <div>
                        <p className="title">Prices and pool share</p>
                        <div className="prices-bg">
                            <div className="price-item">
                                <p className="token">
                                    {token1} per {token2}
                                </p>
                                <p className="price">0.005</p>
                            </div>
                            <div className="price-item">
                                <p className="token">
                                    {token2} per {token1}
                                </p>
                                <p className="price">0.005</p>
                            </div>
                            <div className="price-item">
                                <p className="token">Share of Pool</p>
                                <p className="price">4.58%</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
