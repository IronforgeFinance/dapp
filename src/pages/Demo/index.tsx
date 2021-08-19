import React, { useState, useCallback } from 'react';
import './index.less';
import { notification } from 'antd';
import SelectTokens from '@/components/SelectTokens';
import CommentaryCard from '@/components/CommentaryCard';
// import DebtItemRatio from '@/components/DebtItemRatio';
// import DebtItem from '@/components/DebtItem';
import message from '@iron/Notification';
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
