import React, { useState, useCallback } from 'react';
import DebtItemRatio, { DebtRatio } from '@/components/DebtItemRatio';
import IconDown from '@/assets/images/down.svg';
import './index.less';

interface DebtItemProps {
    balance: string | number;
    mintedToken: string;
    mintedTokenName: string;
    mintedTokenNum: string | number;
    debtRatios: DebtRatio[];
    fusdBalance: string | number;
}

const colors = ['yellow', 'green', 'blue', 'red', 'cyan'];

export default (props: DebtItemProps) => {
    const {
        mintedTokenName = 'mintedTokenName',
        mintedToken,
        mintedTokenNum,
        fusdBalance,
        debtRatios = [],
    } = props;

    const [showInfos, setShowInfos] = useState(false);

    const showInfoHandler = useCallback(() => setShowInfos(!showInfos), [
        showInfos,
    ]);

    return (
        <div className="debt-item">
            <div className="debt-item-head">
                <div className="debt-token">
                    <div className={`bubble ${mintedTokenName.toLowerCase()}`}>
                        {mintedTokenName}
                    </div>
                    <div className="token-minted">
                        <span>{mintedToken}</span>
                        <span>{mintedTokenNum}</span>
                    </div>
                </div>
                <div
                    className={`debt-in-usd ${
                        showInfos ? 'show-infos' : 'hide-infos'
                    }`}
                    onClick={showInfoHandler}
                >
                    <p>${fusdBalance}</p>
                    <img src={IconDown} />
                </div>
            </div>
            {showInfos ? (
                <div className="infos">
                    <ul className="cols">
                        <li>Collateral</li>
                        <li>Ratio</li>
                        <li>Debt</li>
                        <li>Locked</li>
                    </ul>
                    <ul className="rows">
                        {new Array(3).fill('').map((item, index) => {
                            return (
                                <li className="debt">
                                    <ul className="debt-head">
                                        <li className="collateral">
                                            <i
                                                className={`dot color-${colors[index]}`}
                                            />
                                            <span>{'BTC'}</span>
                                        </li>
                                        <li className="ratio">{'49%'}</li>
                                        <li className="debt">{'11.00'}</li>
                                        <li className="locked">{'0.00'}</li>
                                    </ul>
                                    <div
                                        style={{
                                            width: `${(6 - index) * 10}%`,
                                        }}
                                        className={`bar color-${colors[index]}`}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                <DebtItemRatio debtRatios={debtRatios} />
            )}
        </div>
    );
};
