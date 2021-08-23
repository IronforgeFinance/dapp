import React, { useState } from 'react';
import StakeForm from './components/StakeForm';
import PoolItem from './components/PoolItem';
import './index.less';
import classnames from 'classnames';
import { IStakePool } from '@/models/stakeData';

export default (props: IStakePool) => {
    const [showStakeForm, setShowStakeForm] = useState(false);
    const handleFlipper = () => {
        setShowStakeForm(!showStakeForm);
    };
    const [token1, token2] = props.name.split('-');
    return (
        <div
            className={classnames(
                'flip-container',
                showStakeForm ? 'flipper-over' : '',
            )}
        >
            <div className="flipper">
                <div className="front">
                    <div className={`lp-token lp-token-left`}>
                        <div className={`lp-token-${token1}`}></div>
                    </div>
                    <div className={`lp-token lp-token-right`}>
                        <div className={`lp-token-${token2}`}></div>
                    </div>

                    <PoolItem pool={props} handleFlipper={handleFlipper} />
                </div>
                <div className="back">
                    <div className={`lp-token lp-token-left`}>
                        <div className={`lp-token-${token1}`}></div>
                    </div>
                    <div className={`lp-token lp-token-right`}>
                        <div className={`lp-token-${token2}`}></div>
                    </div>
                    <StakeForm lp={props.name} handleFlipper={handleFlipper} />
                </div>
            </div>
        </div>
    );
};
