import './less/index.less';

import React, {
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
} from 'react';
import { InputNumber, Select, Progress, Button } from 'antd';
import * as message from '@/components/Notification';
import IconAdd from '@/assets/images/icon-add.svg';
import { useBep20Balance } from '@/hooks/useTokenBalance';
import { useModel, useIntl } from 'umi';
import { useWeb3React } from '@web3-react/core';
import LpItem from '../LpItem';
import Contracts from '@/config/constants/contracts';
import { useRouter } from '@/hooks/useContract';
import Tokens from '@/config/constants/tokens';
import { ILpDataProps } from '@/models/lpData';
import { ethers } from 'ethers';
import { registerToken } from '@/utils/wallet';
import { DEADLINE } from '@/config/constants/constant';
import { TokenSelectorContext } from '@/components/TokenSelector';
import { ITabKeyContext } from '../../index';
import {
    useCheckERC20ApprovalStatus,
    useERC20Approve,
} from '@/hooks/useApprove';
import { TokenIcon } from '@/components/Icon';
import Folder from '@/components/Folder';
import { PROVIDED_LP_TOKENS } from '@/config';

const TOKENS = Array.from(
    new Set(
        PROVIDED_LP_TOKENS.map((item) => item.split('-')).reduce(
            (arr, item) => arr.concat(item),
            [],
        ),
    ),
).map((item) => ({ name: item }));

const NO_LIQUIDITY_LP = {
    symbol: '',
    address: '',
    balance: 0,
    total: 0,
    reserve1: 0,
    reserve2: 0,
    token1: '',
    token2: '',
    token1Balance: 0,
    token2Balance: 0,
    token1Price: 0,
    token2Price: 0,
    share: 1,
};
export default () => {
    // const [token1Balance, setToken1Balance] = useState();
    // const [token2Balance, setToken2Balance] = useState();
    const intl = useIntl();
    const { account } = useWeb3React();
    const [token1, setToken1] = useState<string>('');
    const [token2, setToken2] = useState<string>('');
    const [token1Amount, setToken1Amount] = useState<number>();
    const [token2Amount, setToken2Amount] = useState<number>();
    const [token1Price, setToken1Price] = useState(1);
    const [token2Price, setToken2Price] = useState(1);
    const [share, setShare] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const {
        lpDataList,
        currentLpData,
        setCurrentLpData,
        setLpDataList,
        fetchLpDataInfo,
        fetchLpDataList,
    } = useModel('lpData', (model) => ({ ...model }));

    const { requestConnectWallet } = useModel('app', (model) => ({
        requestConnectWallet: model.requestConnectWallet,
    }));
    const { open } = useContext(TokenSelectorContext);

    const routerContract = useRouter();

    const pancakeRouter = Contracts.PancakeRouter[process.env.APP_CHAIN_ID];
    const { isApproved: token1Approved, setLastUpdated: setToken1LastUpdated } =
        useCheckERC20ApprovalStatus(
            token1 ? Tokens[token1].address[process.env.APP_CHAIN_ID] : '',
            pancakeRouter,
        );

    const { isApproved: token2Approved, setLastUpdated: setToken2LastUpdated } =
        useCheckERC20ApprovalStatus(
            token2 ? Tokens[token2].address[process.env.APP_CHAIN_ID] : '',
            pancakeRouter,
        );

    const {
        handleApprove: handleToken1Approve,
        requestedApproval: requestedToken1Approval,
    } = useERC20Approve(
        token1 ? Tokens[token1].address[process.env.APP_CHAIN_ID] : '',
        pancakeRouter,
        setToken1LastUpdated,
    );

    const {
        handleApprove: handleToken2Approve,
        requestedApproval: requestedToken2Approval,
    } = useERC20Approve(
        token2 ? Tokens[token2].address[process.env.APP_CHAIN_ID] : '',
        pancakeRouter,
        setToken2LastUpdated,
    );

    const handleAllApprove = () => {
        if (!token1Approved && token1) {
            handleToken1Approve();
            return; // 一次按钮点击处理一次approve
        }
        if (!token2Approved && token2) {
            handleToken2Approve();
            return;
        }
    };

    const refresh = async () => {
        try {
            await fetchLpDataList(PROVIDED_LP_TOKENS, account);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        refresh();
    }, [account]);

    useEffect(() => {
        if (currentLpData) {
            if (token1 !== currentLpData.token1) {
                setToken1(currentLpData.token1);
            }
            if (token2 !== currentLpData.token2) {
                setToken2(currentLpData.token2);
            }
            updateToken2Amount(token1Amount);
            setToken1Price(currentLpData.token1Price);
            setToken2Price(currentLpData.token2Price);
            setShare(currentLpData.share);
        }
    }, [currentLpData]);

    const { balance: token1Balance } = useBep20Balance(token1);
    const { balance: token2Balance } = useBep20Balance(token2);

    const isValidLp = (token1, token2) => {
        if (
            PROVIDED_LP_TOKENS.includes(`${token1}-${token2}`) ||
            PROVIDED_LP_TOKENS.includes(`${token2}-${token1}`)
        ) {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        //compute new share
        if (!token1 || !token2 || !token1Amount || !token2Amount) {
            return;
        }
        let newLiquidity;
        if (currentLpData.total === 0) {
            //share is 100%. Do noting
        } else {
            let reserve1, reserve2;
            if (token1 === currentLpData.token1) {
                reserve1 = currentLpData.reserve1;
                reserve2 = currentLpData.reserve2;
            } else if (token1 === currentLpData.token2) {
                reserve1 = currentLpData.reserve2;
                reserve2 = currentLpData.reserve1;
            }

            newLiquidity = Math.min(
                (token1Amount * currentLpData.total) / reserve1,
                (token2Amount * currentLpData.total) / reserve2,
            );
            const newShare =
                (newLiquidity + currentLpData.balance) /
                (newLiquidity + currentLpData.total);
            setShare(newShare);
        }
    }, [token1Amount, token2Amount, currentLpData]);

    const getCurrentLpData = (token1, token2) => {
        if (isValidLp(token1, token2)) {
            return lpDataList.find(
                (item) =>
                    item.symbol === `${token1}-${token2}` ||
                    item.symbol === `${token2}-${token1}`,
            );
        } else {
            return Object.assign({}, NO_LIQUIDITY_LP, {
                symbol: `${token1}-${token2}`,
                token1,
                token2,
            });
        }
    };

    const updateToken2Amount = (token1Amount) => {
        if (token1Amount && token1 && token2) {
            const token2Price =
                currentLpData.token1 === token1
                    ? currentLpData.token2Price
                    : currentLpData.token1Price;
            const token2Amount = token2Price * token1Amount;
            setToken2Amount(token2Amount);
        } else {
            setToken2Amount(undefined);
        }
    };

    const updateToken1Amount = (token2Amount) => {
        if (token2Amount && token2 && token1) {
            const token1Price =
                currentLpData.token2 === token2
                    ? currentLpData.token1Price
                    : currentLpData.token2Price;
            const token1Amount = token1Price * token2Amount;
            setToken1Amount(token1Amount);
        } else {
            setToken1Amount(undefined);
        }
    };

    const token1AmountHandler = (v) => {
        setToken1Amount(v);
        if (isValidLp(token1, token2)) {
            updateToken2Amount(v);
        } else {
            setToken1Price(v);
        }
    };

    const token2AmountHandler = (v) => {
        setToken2Amount(v);
        if (isValidLp(token1, token2)) {
            updateToken1Amount(v);
        } else {
            setToken2Price(v);
        }
    };

    //TODO 只支持预先设定的lp pair。
    const token1SelectHandler = (v) => {
        console.log('tokens: ', token1, token2);
        if (token2 === v) {
            setToken2(token1);
            setToken1(v);
            setToken1Amount(token2Amount);
            setToken2Amount(token1Amount);
        } else {
            setToken1(v);
            updateToken2Amount(token1Amount);
        }
    };

    useEffect(() => {
        if (token1 && token2) {
            const data = getCurrentLpData(token1, token2);
            setCurrentLpData(data);
        }
    }, [token1, token2]);

    const token2SelectHandler = (v) => {
        if (token1 === v) {
            setToken1(token2);
            setToken2(v);
            setToken1Amount(token2Amount);
            setToken2Amount(token1Amount);
        } else {
            setToken2(v);
            updateToken1Amount(token2Amount);
        }
    };

    const registerLP = async (token1, token2) => {
        // 目前都是官方预先添加的流动性，token地址从配置中获取,否则从合约中获取
        const symbol = `${token1}=${token2}`;
        const address = Tokens[symbol]?.address[process.env.APP_CHAIN_ID];
        if (!address) return;
        registerToken(address, symbol, 18, '');
    };

    const renderBtns = useMemo(() => {
        if (!account) {
            return (
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
            );
        } else if (account && (!token1 || !token2)) {
            return (
                <Button className="common-btn common-btn-red" disabled>
                    {intl.formatMessage({
                        id: 'liquidity.provide',
                    })}
                </Button>
            );
        } else if (
            account &&
            ((token1 && !token1Approved) || (token2 && !token2Approved))
        ) {
            return (
                <Button
                    className="btn-mint common-btn common-btn-red"
                    onClick={handleAllApprove}
                    loading={requestedToken1Approval || requestedToken2Approval}
                >
                    {intl.formatMessage({
                        id: 'liquidity.provide.approve',
                    })}
                </Button>
            );
        } else if (account && token1Approved && token2Approved) {
            return (
                <Button
                    className="common-btn common-btn-red"
                    onClick={handleProvide}
                    loading={submitting}
                >
                    {intl.formatMessage({
                        id: 'liquidity.provide',
                    })}
                </Button>
            );
        }
    }, [account, token1, token2, token1Approved, token2Approved]);

    const [showTxConfirm, setShowTxConfirm] = useState(false);
    const [tx, setTx] = useState<any | null>(null);

    const handleProvide = async () => {
        if (!account) {
            message.warning('Pls connect wallet');
            return;
        }
        if (!token1 || !token2 || !token1Amount || !token2Amount) {
            message.warning('Pls fill in the blanks');
            return;
        }
        if (token1Amount > token1Balance || token2Amount > token2Balance) {
            message.warning('Insufficient balance');
            return;
        }
        try {
            setSubmitting(true);
            setShowTxConfirm(true);

            setTx({
                from: {
                    token: token1,
                    amount: token1Amount,
                    price: '--',
                },
                to: {
                    token: token2,
                    amount: token2Amount,
                    price: '--',
                },
            });

            const deadline = DEADLINE;
            const chainId = process.env.APP_CHAIN_ID;
            const token1Address = Tokens[token1].address[chainId];
            const token2Address = Tokens[token2].address[chainId];
            const tx = await routerContract.addLiquidity(
                token1Address,
                token2Address,
                ethers.utils.parseEther(String(token1Amount)),
                ethers.utils.parseEther(String(token2Amount)),
                0,
                0,
                account,
                deadline,
            );
            message.info(
                'Provide tx sent out successfully. Pls wait for a while......',
            );
            const receipt = await tx.wait();
            console.log(receipt);
            setSubmitting(false);
            message.success('Provide successfully. Pls check your balance.');
            //更新数据
            refresh();
            //添加新的token
            if (currentLpData.total === 0) {
                registerLP(token1, token2);
            }
        } catch (err) {
            setSubmitting(false);
            console.log(err);
            if (err && err.code === 4001) {
                message.error({
                    message: 'Transaction rejected',
                    description: 'Rejected by user',
                });
                return;
            }
        } finally {
            setShowTxConfirm(false);
        }
    };

    const tabKey = React.useContext(ITabKeyContext);
    const hasLpList = React.useMemo(() => !!lpDataList.length, [lpDataList]);
    const isCurrentTab = React.useMemo(() => tabKey === '1', [tabKey]);

    const openFromTokenList = useCallback(
        () => open(TOKENS, { callback: token1SelectHandler.bind(this) }),
        [],
    );

    const openToTokenList = useCallback(
        () => open(TOKENS, { callback: token2SelectHandler.bind(this) }),
        [],
    );

    return (
        <div className="provide-outer-container">
            <Folder
                placement="left"
                foldingOffest={95}
                value={!isCurrentTab || !hasLpList}
            >
                <div className="lp-list">
                    <div className="header">
                        <p>
                            {intl.formatMessage({
                                id: 'liquidity.yourLiquidity',
                                defaultMessage: 'Your Liquidity',
                            })}
                        </p>
                        <p>
                            {intl.formatMessage({
                                id: 'liquidity.yourLiquidityDesc',
                            })}
                        </p>
                    </div>
                    <div className="lp-list-content">
                        {lpDataList.map((item) => (
                            <LpItem data={item} key={item.symbol} />
                        ))}
                    </div>
                </div>
            </Folder>
            <div className="provide-form common-box">
                <div className="input-item">
                    <p className="label">
                        {intl.formatMessage({ id: 'liquidity.provide.asset0' })}
                    </p>
                    <div className="input-item-content">
                        <div className="content-label">
                            <p className="right">
                                {intl.formatMessage({
                                    id: 'balance:',
                                })}
                                <span className="balance">{token1Balance}</span>
                            </p>
                        </div>
                        <div className="input">
                            <InputNumber
                                value={token1Amount}
                                onChange={token1AmountHandler}
                                placeholder="0.00"
                                className="custom-input"
                                type="number"
                            />
                            <div className="token">
                                <TokenIcon name={token1} size={24} />
                                <Button
                                    className="select-token-btn"
                                    onClick={openFromTokenList}
                                >
                                    {token1 ||
                                        intl.formatMessage({
                                            id: 'selecttoken',
                                        })}
                                    <i className="icon-down size-24" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <i className="icon-arrow-down size-18" />
                <div className="input-item">
                    <p className="label">
                        {intl.formatMessage({ id: 'liquidity.provide.asset1' })}
                    </p>
                    <div className="input-item-content">
                        <div className="content-label">
                            <p className="left"></p>
                            <p className="right">
                                {intl.formatMessage({
                                    id: 'balance:',
                                })}
                                <span className="balance">{token2Balance}</span>
                            </p>
                        </div>
                        <div className="input">
                            <InputNumber
                                value={token2Amount}
                                onChange={token2AmountHandler}
                                placeholder="0.00"
                                className="custom-input"
                                type="number"
                            />
                            <div className="token">
                                <TokenIcon name={token2} size={24} />
                                <Button
                                    className="select-token-btn"
                                    onClick={openToTokenList}
                                >
                                    {token2 ||
                                        intl.formatMessage({
                                            id: 'selecttoken',
                                        })}
                                    <i className="icon-down size-24" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="provide-btn-footer">{renderBtns}</div>
            </div>
            {token1 && token2 && token1Price && token2Price && (
                <div className="provide-prices">
                    <div>
                        <p className="title">Prices and pool share</p>
                        <div className="prices-bg">
                            <div className="prices-and-share">
                                <div className="price-item">
                                    <p className="price">{token1Price}</p>
                                    <p className="token">
                                        {token1} per {token2}
                                    </p>
                                </div>
                                <div className="price-item">
                                    <p className="price">{token2Price}</p>
                                    <p className="token">
                                        {token2} per {token1}
                                    </p>
                                </div>
                                <div className="price-item">
                                    <p className="price">
                                        {share < 0.0001
                                            ? '<0.01%'
                                            : (share * 100).toFixed(2) + '%'}
                                    </p>
                                    <p className="token">Share of Pool</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* <TransitionConfirm
                visable={showTxConfirm}
                onClose={() => setShowTxConfirm(false)}
                dataSource={
                    tx && [
                        {
                            label: 'From',
                            direct: 'from',
                            value: {
                                token: tx.from.token,
                                amount: tx.from.amount,
                                mappingPrice: tx.from.price,
                            },
                        },
                        {
                            label: 'To',
                            direct: 'to',
                            value: {
                                token: tx.to.token,
                                amount: tx.to.amount,
                                mappingPrice: tx.to.price,
                            },
                        },
                    ]
                }
            /> */}
        </div>
    );
};
