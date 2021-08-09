import React from 'react';
import { useMemo } from 'react';
import './index.less';

const colors = ['yellow', 'green', 'blue', 'red', 'cyan'];

export interface DebtRatio {
    token: string;
    percent: string;
}

export interface DebtItemRatioProps {
    debtRatios: DebtRatio[];
}

const parseToDecimal = (percentStr: string) => {
    return parseFloat(percentStr.replace('%', '')) / 100;
};

export default (props: DebtItemRatioProps) => {
    const { debtRatios = [] } = props;

    const fullDisplayRatios = useMemo(() => {
        return debtRatios.slice(0, 3);
    }, [debtRatios]);

    const foldDisplayRatios = useMemo(() => {
        return debtRatios.slice(3);
    }, [debtRatios]);

    return (
        <div className="debt-item-ratio">
            <div className="parameters">
                {fullDisplayRatios.map((ratio, index) => {
                    return (
                        <div key={ratio.token} className="param">
                            <i className={`dot color-${colors[index]}`} />
                            <span className="token">{ratio.token}</span>
                            <span className="percent">{ratio.percent}</span>
                        </div>
                    );
                })}
                {!!(foldDisplayRatios && foldDisplayRatios.length) && (
                    <div className="fold-ratios">
                        <div className="dots">
                            {foldDisplayRatios.map((ratio, index) => {
                                return (
                                    <i
                                        key={ratio.token}
                                        style={{
                                            zIndex:
                                                foldDisplayRatios.length -
                                                index,
                                        }}
                                        className={`dot color-${
                                            colors[
                                                index + fullDisplayRatios.length
                                            ]
                                        }`}
                                    />
                                );
                            })}
                        </div>
                        <span className="rest-count">
                            +{foldDisplayRatios.length}
                        </span>
                    </div>
                )}
            </div>
            <div className="bar">
                {fullDisplayRatios.map((ratio, index) => {
                    return (
                        <div
                            key={ratio.token}
                            className={`percentage color-${colors[index]}`}
                            style={{ width: ratio.percent }}
                        />
                    );
                })}
                {foldDisplayRatios.map((ratio, index) => {
                    return (
                        <div
                            key={ratio.token}
                            className={`percentage color-${
                                colors[index + fullDisplayRatios.length]
                            }`}
                            style={{ width: ratio.percent }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
