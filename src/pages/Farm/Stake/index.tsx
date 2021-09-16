import './less/index.less';

import React, { useState } from 'react';
import StakeForm from './components/StakeForm';
import PoolItem from './components/PoolItem';
import classnames from 'classnames';
import { IStakePool } from '@/models/stakeData';
import { TokenIcon } from '@/components/Icon';
export default (props: IStakePool) => {
    console.log('props: ', props);
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
                        <TokenIcon name={token1}></TokenIcon>
                    </div>
                    <div className={`lp-token lp-token-right`}>
                        <TokenIcon name={token2}></TokenIcon>
                    </div>

                    <PoolItem pool={props} handleFlipper={handleFlipper} />
                </div>
                <div className="back">
                    <div className={`lp-token lp-token-left`}>
                        <TokenIcon name={token1}></TokenIcon>
                    </div>
                    <div className={`lp-token lp-token-right`}>
                        <TokenIcon name={token2}></TokenIcon>
                    </div>
                    <StakeForm lp={props.name} handleFlipper={handleFlipper} />
                </div>
            </div>
        </div>
    );
};
