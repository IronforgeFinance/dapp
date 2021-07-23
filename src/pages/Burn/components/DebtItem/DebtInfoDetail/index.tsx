import React from 'react';
import { IDebtItemInfo } from '../index';
import './index.less';
interface IProps {
    infos: IDebtItemInfo[];
}
export default (props: IProps) => {
    const { infos } = props;
    console.log(infos);
    return (
        <div className="info-detail">
            <div className="header flex-between">
                <span>Collateral</span>
                <span>Ratio</span>
                <span>Debt</span>
                <span>Locked</span>
            </div>
            {infos.map((item) => (
                <div className="info-row " key={item.collateralToken}>
                    <div className="info-data flex-between">
                        <div className="token">
                            <span
                                className={`symbol token-${item.collateralToken}`}
                            ></span>
                            <span>{item.collateralToken}</span>
                        </div>
                        <span>{item.ratio}</span>
                        <span>{item.debt}</span>
                        <span>{item.locked}</span>
                    </div>
                    <div
                        className={`info-ratio token-${item.collateralToken}`}
                        style={{ width: item.ratio }}
                    ></div>
                </div>
            ))}
        </div>
    );
};
