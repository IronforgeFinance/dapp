import React, { useState, useCallback } from 'react';
import './index.less';
import { notification } from 'antd';
import SelectTokens from '@/components/SelectTokens';
import CommentaryCard from '@/components/CommentaryCard';
import DebtItemRatio from '@/components/DebtItemRatio';
import DebtItem from '@/components/DebtItem';
import * as message from '@/components/Notification';
import Popover from '@/components/Popover';
import TransitionConfirm from '@/components/TransitionConfirm';

export default () => {
    // * 选择token演示
    const SelectTokensDemo = () => {
        const [showSetting, setShowSetting] = useState(false);

        return (
            <SelectTokens
                visable={showSetting}
                onClose={() => setShowSetting(false)}
            >
                <button
                    className="btn-select-tokens"
                    onClick={() => setShowSetting(true)}
                >
                    Click Select Tokens
                </button>
            </SelectTokens>
        );
    };

    // * 债务比率显示
    const DebtItemRatioDemo = () => {
        // const mockDebtRatios = [
        //     {
        //         token: 'BTC',
        //         percent: '49%',
        //     },
        //     {
        //         token: 'USDT',
        //         percent: '31%',
        //     },
        //     {
        //         token: 'ETH',
        //         percent: '12%',
        //     },
        //     {
        //         token: 'TOKEN1',
        //         percent: '6%',
        //     },
        //     {
        //         token: 'TOKEN2',
        //         percent: '2%',
        //     },
        // ];
        const mockDebtRatios = [
            {
                token: 'BTC',
                percent: '69%',
            },
            {
                token: 'USDT',
                percent: '31%',
            },
        ];

        return <DebtItemRatio debtRatios={mockDebtRatios} />;
    };

    const TransitionConfirmDemo = () => {
        const [visable, setVisable] = useState(false);

        return (
            <div className="transition-confirm-demo">
                <TransitionConfirm
                    visable={visable}
                    onClose={() => setVisable(false)}
                    dataSource={[
                        {
                            label: 'Collateral',
                            value: {
                                token: 'BNB',
                                amount: 20,
                                mappingPrice: 6162.8,
                            },
                        },
                        {
                            label: 'Minted',
                            value: {
                                token: 'fETH',
                                amount: 5,
                                mappingPrice: 6162.8,
                            },
                        },
                        {
                            label: 'Locked',
                            value: {
                                token: 'ftoken',
                                amount: 0,
                                mappingPrice: 6162.8,
                            },
                        },
                        { label: 'Type', value: 'Delivery' },
                    ]}
                />
                <button onClick={() => setVisable(true)}>
                    Test TransitionConfirm
                </button>
            </div>
        );
    };

    // * 每一项债务数据
    const DebtItemDemo = () => {
        const mockDebts = {
            balance: 88888,
            mintedToken: 'fUSD',
            mintedTokenName: 'USD',
            mintedTokenNum: 100,
            debtRatios: [
                {
                    token: 'BTC',
                    percent: '49%',
                },
                {
                    token: 'USDT',
                    percent: '31%',
                },
                {
                    token: 'ETH',
                    percent: '12%',
                },
                {
                    token: 'TOKEN1',
                    percent: '6%',
                },
                {
                    token: 'TOKEN2',
                    percent: '2%',
                },
            ],
            fusdBalance: 10000,
        };
        return <DebtItem {...mockDebts} />;
    };

    return (
        <div className="demo-container">
            <ul>
                {/* <li>
                    <h3>1. select token list</h3>
                    <SelectTokensDemo />
                </li> */}
                <li>
                    <h3>3. 解说牌</h3>
                    <CommentaryCard
                        title="Begin To Mint"
                        description={
                            'Mint fUSD by staking your Token. Token stakers earn weekly staking rewards .'
                        }
                    />
                </li>
                <li>
                    <h3>4. 债务项进度条</h3>
                    <DebtItemRatioDemo />
                </li>
                <li>
                    <h3>5. 债务项</h3>
                    <DebtItemDemo />
                </li>
                <li>
                    <h3>5. 成功通知</h3>
                    <button
                        onClick={
                            () =>
                                message.success({
                                    message: 'Transaction receipt',
                                    description: 'Mint fUSD from USDC',
                                    showView: true,
                                })
                            // message.success('Transaction success')
                        }
                    >
                        成功
                    </button>
                    <button
                        onClick={() =>
                            // message.fail({
                            //     message: 'Transaction receipt',
                            //     description: 'Mint fUSD from USDC',
                            // })
                            message.fail('Transaction fail')
                        }
                    >
                        失败
                    </button>
                </li>
                <li>
                    <h3>6. Popover</h3>
                    <Popover content="Fuck Qsk!!!!">
                        <button>Open Popover</button>
                    </Popover>
                </li>
                <li>
                    <h3>7. Transition Confirm</h3>
                    <TransitionConfirmDemo />
                </li>
            </ul>
        </div>
    );
};
