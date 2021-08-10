import React from 'react';
import { IDebtItemInfo } from '../index';
import './index.less';
interface IProps {
    infos: IDebtItemInfo[];
}
export default (props: IProps) => {
    const { infos } = props;

    return (
        <div className="info-simple">
            <div className="token-names">
                {infos.map((item) => (
                    <div className="token" key={item.collateralToken}>
                        <span
                            className={`symbol token-${item.collateralToken}`}
                        ></span>
                        <span>{item.collateralToken}</span>
                        <span>{item.ratio}</span>
                    </div>
                ))}
            </div>
            <div className="token-ratios">
                {infos.map((item) => (
                    <div
                        key={item.collateralToken}
                        className={`ratio token-${item.collateralToken.toLowerCase()}`}
                        style={{ width: item.ratio }}
                    ></div>
                ))}
            </div>
        </div>
    );
};
