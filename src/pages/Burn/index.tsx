import React, { useState, useEffect, useCallback, createContext } from 'react';
import DataView from '../Mint/DataView';
import { useWeb3React } from '@web3-react/core';
import { useDebtSystem, useCollateralSystem } from '@/hooks/useContract';
import { ethers } from 'ethers';
import './index.less';
import DebtItem from './components/DebtItem';
import { Button } from 'antd';
import IconBack from '@/assets/images/icon-back.png';
import CommentaryCard from '@/components/CommentaryCard';
import BurnForm from './components/BurnForm';
import { useMemo } from 'react';
import IDebtItem from '@/components/DebtItem';
import classNames from 'classnames';

export default () => {
    const { account } = useWeb3React();
    const collateralSystem = useCollateralSystem();
    const debtSystem = useDebtSystem();
    const [showForm, setShowForm] = useState(false);
    const [currentDebt, setCurrentDebt] = useState(0);

    const onSubmitSuccess = () => {
        setShowForm(false);
    };

    const haveAssets = useMemo(() => true, []); // TODO 获取资产总计

    const BackBtn = () => {
        return (
            <img
                className="btn-back"
                src={IconBack}
                onClick={() => {
                    setShowForm(!showForm);
                }}
            />
        );
    };

    const NoAssetsView = () => {
        const toMintPageHandler = useCallback(
            () => (window.location.href = '/mint'),
            [],
        );

        return (
            <div className="no-assets-view common-box">
                <p className="tip">Don`t have any fAsset</p>
                <Button
                    className="btn-mint common-btn common-btn-red"
                    onClick={toMintPageHandler}
                >
                    Lets Mint
                </Button>
            </div>
        );
    };

    const SearchDebts = () => {
        return (
            <div className="search-debts">
                <div className="search-input-wrapper">
                    <input type="text" placeholder="Search name or your debt" />
                </div>
                <button className="search-btn" />
            </div>
        );
    };

    return (
        <div className="burn-container">
            <DataView />
            {!showForm ? (
                <div className="burn-box">
                    <CommentaryCard
                        title="Your Debt"
                        description="Buy and burn fAsset to clean your total debt and unstake all collateral"
                    />
                    {!haveAssets ? (
                        <NoAssetsView />
                    ) : (
                        <div className="form-view common-box">
                            <SearchDebts />
                            <div className="my-debt">
                                <button
                                    className={classNames({
                                        ratio: true,
                                        active: currentDebt == 0,
                                    })}
                                    onClick={() => setCurrentDebt(0)}
                                />
                                <DebtItem
                                    mintedToken="fUSDC"
                                    mintedTokenName="USD"
                                />
                            </div>
                            <Button
                                className="btn-mint common-btn common-btn-red"
                                onClick={() => setShowForm(!showForm)}
                            >
                                Burn
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="burn-box">
                    <CommentaryCard
                        title="Your Debt"
                        description="Buy and burn fAsset to clean your total debt and unstake all collateral"
                    />
                    <BurnForm onSubmitSuccess={onSubmitSuccess} />
                    <BackBtn />
                </div>
            )}
        </div>
    );
};
