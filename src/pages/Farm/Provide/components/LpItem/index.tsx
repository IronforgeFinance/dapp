import './pc.less';
import './mobile.less';

import { ILpDataProps } from '@/models/lpData';
import React, { useState } from 'react';
import IconDown from '@/assets/images/down.svg';
import { useModel } from 'umi';
import { TokenIcon } from '@/components/Icon';
import { DEADLINE } from '@/config/constants/constant';
import Tokens from '@/config/constants/tokens';
import Contracts from '@/config/constants/contracts';
import { useRouter } from '@/hooks/useContract';
import {
    useCheckERC20ApprovalStatus,
    useERC20Approve,
} from '@/hooks/useApprove';
import { ethers } from 'ethers';

interface IProps {
    data: ILpDataProps;
}
export default (props: IProps) => {
    const { data } = props;
    const [showDetail, setShowDetail] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { setCurrentLpData, setLpDataToRemove } = useModel(
        'lpData',
        (model) => ({
            setCurrentLpData: model.setCurrentLpData,
            setLpDataToRemove: model.setLpDataToRemove,
        }),
    );

    const routerContract = useRouter();
    const pancakeRouter = Contracts.PancakeRouter[process.env.APP_CHAIN_ID];

    const { isApproved, setLastUpdated } = useCheckERC20ApprovalStatus(
        Tokens[data.symbol].address[process.env.APP_CHAIN_ID],
        pancakeRouter,
    );

    const { handleApprove, requestedApproval } = useERC20Approve(
        Tokens[data.symbol].address[process.env.APP_CHAIN_ID],
        pancakeRouter,
        setLastUpdated,
    );

    const handleAddLiquidity = () => {
        setCurrentLpData({ ...data });
    };
    const handleRemove = async () => {
        setLpDataToRemove({ ...data });
    };
    const tokens = data.symbol.split('-');
    return (
        <div className="lp-item-container">
            <div className="header">
                <div className="left">
                    <TokenIcon name={`${tokens[0]}-${tokens[1]}`}></TokenIcon>
                    <div>
                        <p className="title">{data.symbol}</p>
                        <p className="value">{data.balance}</p>
                    </div>
                </div>
                <img
                    src={IconDown}
                    alt=""
                    className={showDetail ? 'icon-up' : ''}
                    onClick={() => {
                        setShowDetail(!showDetail);
                    }}
                />
            </div>
            {showDetail && (
                <div className="detail-info">
                    <div className="info-item">
                        <p className="title">
                            <TokenIcon name={data.token1} />
                            pooled {data.token1}{' '}
                        </p>
                        <p className="value">{data.token1Balance}</p>
                    </div>
                    <div className="info-item">
                        <p className="title">
                            <TokenIcon name={data.token2} />
                            pooled {data.token2}{' '}
                        </p>
                        <p className="value"> {data.token2Balance}</p>
                    </div>
                    <div className="info-item">
                        <p className="title">share of pool </p>
                        <p className="value">
                            {'> '}
                            {data.share < 0.00001
                                ? '<0.01%'
                                : (data.share * 100).toFixed(2) + '%'}
                        </p>
                    </div>
                    <div className="btns">
                        <button
                            className="common-btn common-btn-red common-btn-s"
                            onClick={handleAddLiquidity}
                        >
                            Add Liquidity
                        </button>
                        <button
                            className="common-btn common-btn-red common-btn-s"
                            onClick={handleRemove}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
