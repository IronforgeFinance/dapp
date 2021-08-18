import React from 'react';
import { IDebtItemInfo } from '../index';
import './index.less';

const colors = ['yellow', 'green', 'blue', 'red', 'cyan'];
interface IProps {
    infos: IDebtItemInfo[];
}
export default (props: IProps) => {
    const { infos } = props;
    console.log(infos);
    return (
        <div className="infos">
            <ul className="cols">
                <li>Collateral</li>
                <li>Ratio</li>
                <li>Debt</li>
                <li>Locked</li>
            </ul>
            <ul className="rows">
                {infos.map((item, index) => {
                    return (
                        <li key={item.collateralToken} className="debt">
                            <ul className="debt-head">
                                <li className="collateral">
                                    <i
                                        className={`dot dot-${item.collateralToken.toLowerCase()}`}
                                    />
                                    <span>{item.collateralToken}</span>
                                </li>
                                <li className="ratio">{item.ratio}</li>
                                <li className="debt">{item.debt}</li>
                                <li className="locked">{item.locked}</li>
                            </ul>
                            <div
                                style={{ width: item.ratio }}
                                className={`move-bar bar-${item.collateralToken.toLowerCase()}`}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
