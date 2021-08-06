import React, { useState, useCallback } from 'react';
import './index.less';
import SelectTokens from '@/components/SelectTokens';
import ConfirmTransaction from '@/components/ConfirmTransaction';
import CommentaryCard from '@/components/CommentaryCard';

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
            </ul>
        </div>
    );
};
