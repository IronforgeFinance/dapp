import React, { useState, useEffect } from 'react';
import DataView from '../Mint/DataView';
import { useWeb3React } from '@web3-react/core';
import { useDebtSystem, useCollateralSystem } from '@/hooks/useContract';
import { ethers } from 'ethers';
import './index.less';
import DebtItem from './components/DebtItem';
import { Button } from 'antd';
import IconBack from '@/assets/images/icon-back.png';
import BurnForm from './components/BurnForm';

export default () => {
    const { account } = useWeb3React();
    const collateralSystem = useCollateralSystem();
    const debtSystem = useDebtSystem();
    const [showForm, setShowForm] = useState(false);

    const getDebtInUSD = async (account: string) => {
        let res = await debtSystem.GetUserDebtBalanceInUsd(account);
        res = res.map((item) => ethers.utils.formatUnits(item, 18));
        console.log('getDebtInUSD: ', res);
    };

    const getCollateralData = async (account, token) => {
        const res = await collateralSystem.getUserCollateral(
            account,
            ethers.utils.formatBytes32String(token),
        );
        console.log(
            'getCollateralData: ',
            token,
            ethers.utils.formatUnits(res, 18),
        );
    };

    useEffect(() => {
        if (account) {
            // getDebtInUSD(account)
            // getCollateralData(account, 'BTC')
            // getCollateralData(account, 'USDT')
            // getCollateralData(account, 'ETH')
        }
    }, [account]);

    const onSubmitSuccess = () => {
        setShowForm(false);
    };

    return (
        <div className="burn-container">
            <DataView />
            {!showForm && (
                <div className="burn-box common-box">
                    <div className="head">
                        <p>
                            Buy and burn fAsset to clean your total debt and
                            unstake all collateral
                        </p>
                    </div>
                    <div className="content-box">
                        <DebtItem mintedToken="fUSDT" mintedTokenName="USD" />
                    </div>
                    <div className="btn-burn">
                        <Button
                            className="btn-mint"
                            onClick={() => setShowForm(!showForm)}
                        >
                            Burn
                        </Button>
                    </div>
                </div>
            )}
            {showForm && (
                <div className="burn-form-container">
                    <img
                        src={IconBack}
                        alt=""
                        onClick={() => {
                            setShowForm(!showForm);
                        }}
                    />
                    <BurnForm onSubmitSuccess={onSubmitSuccess} />
                </div>
            )}
        </div>
    );
};
