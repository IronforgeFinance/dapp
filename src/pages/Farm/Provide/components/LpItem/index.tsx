import { ILpDataProps } from '@/models/lpData';
import React, { useState } from 'react';

interface IProps {
    data: ILpDataProps;
}
export default (props: IProps) => {
    const { data } = props;
    const [showDetail, setShowDetail] = useState(false);
    return (
        <div className="lp-item-container">
            <div className="header">{data.symbol}</div>
            {showDetail && (
                <div className="detail-info">
                    <div className="info-item">
                        <p className="lale">pooled </p>
                        <p className="value"></p>
                    </div>
                    <div className="info-item">
                        <p className="lale">pooled </p>
                        <p className="value"></p>
                    </div>
                    <div className="info-item">
                        <p className="lale">pooled </p>
                        <p className="value"></p>
                    </div>
                    <div className="btns">
                        <button className="common-btn common-btn-red common-btn-s">
                            Add Liquidity
                        </button>
                        <button className="common-btn common-btn-red common-btn-s">
                            Removes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
