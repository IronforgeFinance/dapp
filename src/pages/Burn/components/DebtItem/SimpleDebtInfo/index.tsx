import RainbowBar from '@/components/RainbowBar';
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
                            className={`dot dot-${item.collateralToken.toLowerCase()}`}
                        />
                        <span>{item.collateralToken}</span>
                        <span>{item.ratio}</span>
                    </div>
                ))}
            </div>
            <div className="token-ratios">
                <RainbowBar
                    width={318}
                    dataSource={infos.map((item) => ({
                        token: item.collateralToken,
                        rate: Number(item.ratioValue) / 100,
                    }))}
                />
            </div>
        </div>
    );
};
