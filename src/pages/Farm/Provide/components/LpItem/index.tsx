import { ILpDataProps } from '@/models/lpData';
import React, { useState } from 'react';
import './index.less';
import IconDown from '@/assets/images/down.svg';
import { useModel } from 'umi';
interface IProps {
    data: ILpDataProps;
}
export default (props: IProps) => {
    const { data } = props;
    const [showDetail, setShowDetail] = useState(false);
    const { setCurrentLpData } = useModel('lpData', (model) => ({
        setCurrentLpData: model.setCurrentLpData,
    }));

    const handleAddLiquidity = () => {
        setCurrentLpData({ ...data });
    };
    const handleRemove = () => {
        //TODO
    };
    return (
        <div className="lp-item-container">
            <div className="header">
                <div className="left">
                    <p className="title">{data.symbol}</p>
                    <p className="value">{data.balance}</p>
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
                        <p className="title">pooled {data.token1} </p>
                        <p className="value">{data.token1Balance}</p>
                    </div>
                    <div className="info-item">
                        <p className="title">pooled {data.token2} </p>
                        <p className="value"> {data.token2Balance}</p>
                    </div>
                    <div className="info-item">
                        <p className="title">share of pool </p>
                        <p className="value">
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
