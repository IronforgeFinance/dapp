import './less/index.less';

import React, { useState, useEffect, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
    useDebtSystem,
    useCollateralSystem,
    usePrices,
} from '@/hooks/useContract';
import { ethers } from 'ethers';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import IconDown from '@/assets/images/down.svg';
import DebtInfoDetail from './components/DebtInfoDetail';
import DebtInfoSimple from './components/SimpleDebtInfo';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import { useModel } from 'umi';
import { COLLATERAL_TOKENS } from '@/config';
import { TokenIcon } from '@/components/Icon';
import { getTokenPrice } from '@/utils';
import { IDebtItemInfo } from '@/models/burnData';

interface IDebtItemProps {}

export default (props: IDebtItemProps) => {
    const [showInfos, setShowInfos] = useState(true);

    const { debtItemInfos, totalDebtInUSD } = useModel('burnData', (model) => ({
        ...model,
    }));

    const { lockedData, setLockedData } = useModel('dataView', (model) => ({
        lockedData: model.lockedData,
        setLockedData: model.setLockedData,
    }));

    return (
        <div className="debt-item">
            {/* <div className="debt-item-head">
                <div className="debt-token">
                    <TokenIcon size={36} name={mintedToken} />
                    <div className="token-minted">
                        <span>{mintedToken}</span>
                        <span>{mintedTokenNum}</span>
                    </div>
                </div>
                <div
                    className={`debt-in-usd ${
                        showInfos ? 'show-infos' : 'hide-infos'
                    }`}
                    onClick={() => setShowInfos(!showInfos)}
                >
                    <p>${fusdBalance}</p>
                    <img src={IconDown} />
                </div>
            </div> */}
            <section className="your-debts">
                <div className="summary">
                    <div className="data">
                        <span className="label">Your Debt Value</span>
                        <span className="value">{totalDebtInUSD} fUSD</span>
                    </div>
                </div>
            </section>
            <div className="content-box">
                {!showInfos && <DebtInfoSimple infos={debtItemInfos} />}
                {showInfos && <DebtInfoDetail infos={debtItemInfos} />}
            </div>
        </div>
    );
};
