import './pc.less';
import './mobile.less';

import React, {
    useState,
    useEffect,
    useCallback,
    createContext,
    Fragment,
} from 'react';
import DataView from '../Mint/components/DataView';
import { useWeb3React } from '@web3-react/core';
import { useDebtSystem, useCollateralSystem } from '@/hooks/useContract';
import { ethers } from 'ethers';
import DebtItem from './components/DebtItem';
import { Button } from 'antd';
import IconBack from '@/assets/images/icon-back.png';
import CommentaryCard from '@/components/CommentaryCard';
import BurnForm from './components/BurnForm';
import { useMemo } from 'react';
import classNames from 'classnames';
import { useModel, useIntl } from 'umi';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import { COLLATERAL_TOKENS } from '@/config';
import { TokenIcon } from '@/components/Icon';
import { getTokenPrice } from '@/utils';
import { toFixedWithoutRound } from '@/utils/bigNumber';
import { IDebtItemInfo } from '@/models/burnData';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import useEnv from '@/hooks/useEnv';
import {
    getCollateralSystemContract,
    getDebtSystemContract,
} from '@/utils/contractHelper';

export default () => {
    const intl = useIntl();
    const { account } = useWeb3React();
    const collateralSystem = getCollateralSystemContract();
    const debtSystem = getDebtSystemContract();
    const [showForm, setShowForm] = useState(false);
    const [currentDebt, setCurrentDebt] = useState(0);
    const { balance: fusdBalance } = useBep20Balance('FUSD');
    const provider = useWeb3Provider();
    const { isMobile } = useEnv();

    const { requestConnectWallet, collateralTokens } = useModel(
        'app',
        (model) => ({
            collateralTokens: model.collateralTokens,
            requestConnectWallet: model.requestConnectWallet,
        }),
    );

    const { setDebtItemInfos, setTotalDebtInUSD } = useModel(
        'burnData',
        (model) => ({
            ...model,
        }),
    );

    /* TODO:合约接口没有查询total debt in usd，
    只能查询某个抵押物currency 对应的debt in usd。
    前端先写死支持的币，然后分别查询debt in usd，并求和; 
    */
    const getDebtInUSD = useCallback(async () => {
        const res = await Promise.all(
            collateralTokens.map((token) =>
                debtSystem.GetUserDebtBalanceInUsd(
                    account,
                    ethers.utils.formatBytes32String(token.name),
                ),
            ),
        );

        const totalDebtInUsd = res.reduce((total, item) => {
            const val = parseFloat(ethers.utils.formatUnits(item[0], 18));
            total += val;
            return total;
        }, 0);
        const val = toFixedWithoutRound(totalDebtInUsd, 2);
        setTotalDebtInUSD(val);
    }, [collateralTokens]);

    const getCollateralDataByToken = async (account, token) => {
        const res = await collateralSystem.getUserCollateral(
            account,
            ethers.utils.formatBytes32String(token),
        );
        const data = parseFloat(ethers.utils.formatUnits(res, 18));
        const price = await getTokenPrice(token);
        const collateralInUSD = data * price;
        console.log('getCollateralData: ', token, data);
        const lockRes = await collateralSystem.userLockedData(
            account,
            ethers.utils.formatBytes32String(token),
        );
        const lockData = parseFloat(ethers.utils.formatEther(lockRes));
        return {
            collateral: data,
            inUSD: collateralInUSD,
            locked: lockData,
        };
    };

    const getDebtInfo = async () => {
        const tokens = collateralTokens.map((token) => token.name);
        const res = await Promise.all(
            tokens.map((token) => getCollateralDataByToken(account, token)),
        );

        const total = res.reduce((total, item, i) => {
            return total + item.inUSD;
        }, 0);

        const totalLocked = res.reduce((total, item) => {
            return total + item.locked;
        }, 0);
        // setLockedData({
        //     ...lockedData,
        //     startValue: totalLocked,
        //     endValue: totalLocked,
        // });
        const infos = res.map((item, index) => {
            const ratioValue =
                total > 0 ? Number((100 * item.inUSD) / total).toFixed(2) : 0;
            return {
                collateralToken: tokens[index],
                ratio: ratioValue + '%',
                ratioValue,
                collateral: item.collateral,
                locked: item.locked,
            } as IDebtItemInfo;
        });
        infos.sort((a, b) => Number(b.ratioValue) - Number(a.ratioValue));
        setDebtItemInfos(infos);
    };

    const refreshData = () => {
        if (account) {
            getDebtInUSD();
            getDebtInfo();
        }
    };

    useEffect(() => {
        if (account) {
            refreshData();
        }
    }, [account, collateralTokens]); //fixme: provider 不是metask时合约接口会报错。

    const onSubmitSuccess = () => {
        setShowForm(false);
        refreshData();
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

    return (
        <Fragment>
            {!isMobile && <DataView />}
            <div className="burn-box">
                {!isMobile && (
                    <CommentaryCard
                        title={intl.formatMessage({
                            id: 'burnCommentaryTitile',
                        })}
                        description={intl.formatMessage({
                            id: 'burnCommentaryDesc',
                        })}
                    />
                )}
                <BurnForm onSubmitSuccess={onSubmitSuccess} />
            </div>
            {isMobile && <DataView />}
        </Fragment>
    );
};
