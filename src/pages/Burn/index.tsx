import React, {
    useState,
    useEffect,
    useCallback,
    createContext,
    Fragment,
} from 'react';
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
import { useModel, useIntl } from 'umi';
import { useBep20Balance } from '@/hooks/useTokenBalance';
export default () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const collateralSystem = useCollateralSystem();
    const debtSystem = useDebtSystem();
    const [showForm, setShowForm] = useState(false);
    const [currentDebt, setCurrentDebt] = useState(0);
    const { balance: fusdBalance } = useBep20Balance('FUSD');

    const { requestConnectWallet } = useModel('app', (model) => ({
        requestConnectWallet: model.requestConnectWallet,
    }));

    const onSubmitSuccess = () => {
        setShowForm(false);
    };

    const haveAssets = useMemo(() => /*fusdBalance > 0*/ true, []); // TODO 获取资产总计

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
                <p className="tip">
                    {intl.formatMessage({ id: 'burn.noassets' })}
                </p>
                <Button
                    className="btn-mint common-btn common-btn-red"
                    onClick={toMintPageHandler}
                >
                    {intl.formatMessage({ id: 'burn.tomint' })}
                </Button>
            </div>
        );
    };

    const SearchDebts = () => {
        return (
            <div className="search-debts">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder={intl.formatMessage({ id: 'burn.search' })}
                    />
                </div>
                <button className="search-btn" />
            </div>
        );
    };

    return (
        <div className="burn-container">
            <DataView />
            <div className="burn-box">
                <CommentaryCard
                    title={intl.formatMessage({ id: 'burn.title' })}
                    description={intl.formatMessage({ id: 'burn.desc' })}
                />
                <Fragment>
                    {!showForm && (
                        <Fragment>
                            {!haveAssets && <NoAssetsView />}
                            {haveAssets && (
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
                                            mintedToken="FUSD"
                                            mintedTokenName="USD"
                                        />
                                    </div>
                                    {account && (
                                        <Button
                                            className="btn-mint common-btn common-btn-red"
                                            onClick={() =>
                                                setShowForm(!showForm)
                                            }
                                        >
                                            {intl.formatMessage({
                                                id: 'burn.burn',
                                            })}
                                        </Button>
                                    )}
                                    {!account && (
                                        <Button
                                            className="btn-mint common-btn common-btn-yellow"
                                            onClick={() => {
                                                requestConnectWallet();
                                            }}
                                        >
                                            {intl.formatMessage({
                                                id: 'app.unlockWallet',
                                            })}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </Fragment>
                    )}
                    {showForm && (
                        <Fragment>
                            <BurnForm onSubmitSuccess={onSubmitSuccess} />
                            <BackBtn />
                        </Fragment>
                    )}
                </Fragment>
            </div>
        </div>
    );
};
