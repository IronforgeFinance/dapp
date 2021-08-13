import React, { useState, useCallback } from 'react';
import './index.less';
import { notification } from 'antd';
import SelectTokens from '@/components/SelectTokens';
import ConfirmTransaction from '@/components/ConfirmTransaction';
import CommentaryCard from '@/components/CommentaryCard';
import DebtItemRatio from '@/components/DebtItemRatio';
import DebtItem from '@/components/DebtItem';
import { success, fail } from '@/components/Notification';
import Popover from '@/components/Popover';

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

    // * 交易确认演示
    const ConfirmTransactionDemo = () => {
        const [show, setShow] = useState(false);
        const onCloseMemo = useCallback(() => setShow(false), []);
        const onShowMemo = useCallback(() => setShow(true), []);

        const mockData = [
            {
                prop: 'Burned',
                value: 100,
                token: 'fUSD',
                extra: '$6,162.8',
            },
            {
                prop: 'Burned',
                value: 100,
                token: 'fUSD',
            },
            {
                prop: 'Burned',
                value: 100,
                token: 'fUSD',
            },
            {
                prop: 'Burned',
                value: 100,
                token: 'fUSD',
            },
            {
                prop: 'Burned',
                value: 100,
                token: 'fUSD',
            },
            {
                prop: 'Burned',
                value: 100,
                token: 'fUSD',
            },
            {
                prop: 'Burned',
                value: 100,
                token: 'fUSD',
            },
            {
                prop: 'Burned',
                value: 100,
                token: 'fUSD',
            },
        ];

        return (
            <ConfirmTransaction
                visable={show}
                onClose={onCloseMemo}
                dataSource={mockData}
            >
                <button className="confirm-transaction" onClick={onShowMemo}>
                    Click Confirm Transaction
                </button>
            </ConfirmTransaction>
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
                <li>
                    <h3>1. select token list</h3>
                    <SelectTokensDemo />
                </li>
                <li>
                    <h3>2. confirm transaction</h3>
                    <ConfirmTransactionDemo />
                </li>
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
                        onClick={() =>
                            success({
                                message: 'Transaction receipt',
                                description: 'Mint fUSD from USDC',
                                showView: true,
                            })
                        }
                    >
                        成功
                    </button>
                    <button
                        onClick={() =>
                            fail({
                                message: 'Transaction receipt',
                                description: 'Mint fUSD from USDC',
                            })
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
            </ul>
        </div>
    );
};
