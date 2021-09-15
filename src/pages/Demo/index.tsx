import React, { useState } from 'react';
import './index.less';
import CommentaryCard from '@/components/CommentaryCard';
import message from '@iron/Notification';
import WalletModal from '@/layouts/components/WalletModal';
import { BSCSCAN_EXPLORER } from '@/config/constants/constant';

export default () => {
    // * 选择token演示
    const SelectTokensDemo = () => {
        const [showSetting, setShowSetting] = useState(false);

        return <div></div>;
    };

    const TransitionConfirmDemo = () => {
        const [visable, setVisable] = useState(false);

        return (
            <div className="transition-confirm-demo">
                <button onClick={() => setVisable(true)}>
                    Test TransitionConfirm
                </button>
            </div>
        );
    };

    const WalletConnectDemo = () => {
        const [visable, setVisable] = React.useState(false);

        return (
            <div className="wallet-connect-demo">
                <WalletModal
                    visable={visable}
                    closeOnIconClick={() => setVisable(false)}
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
                                    scanHref: BSCSCAN_EXPLORER,
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
                    <button
                        onClick={() =>
                            // message.fail({
                            //     message: 'Transaction receipt',
                            //     description: 'Mint fUSD from USDC',
                            // })
                            message.loading({
                                message: '123',
                                description: '123',
                                scale: () => {},
                                revert: () => {},
                            })
                        }
                    >
                        Loading
                    </button>
                </li>
                {/* <li>
                    <h3>6. Popover</h3>
                    <Popover content="Fuck Qsk!!!!">
                        <button>Open Popover</button>
                    </Popover>
                </li> */}
                <li>
                    <h3>7. Transition Confirm</h3>
                    <TransitionConfirmDemo />
                </li>
                <li>
                    <h3>8. 钱包连接</h3>
                    <WalletConnectDemo />
                </li>
            </ul>
        </div>
    );
};
