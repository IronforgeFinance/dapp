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

    const DebsView = () => {
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
        return <IDebtItem {...mockDebts} />;
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
                            {/* <DebtItem
                                mintedToken="fUSDC"
                                mintedTokenName="USD"
                            /> */}
                            <div className="debt-list">
                                {new Array(4).fill('').map((item, index) => (
                                    <div className="debt-item-wrapper">
                                        <button
                                            className={classNames({
                                                ratio: true,
                                                active: currentDebt == index,
                                            })}
                                            onClick={() =>
                                                setCurrentDebt(index)
                                            }
                                        />
                                        <DebsView />
                                    </div>
                                ))}
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
