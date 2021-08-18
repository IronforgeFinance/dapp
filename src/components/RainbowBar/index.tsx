import React from 'react';
import './index.less';

interface TokenRate {
    token: string;
    rate: number;
}

interface BarStyle {
    width?: number;
    height?: number;
}

interface RainbowBarProps extends BarStyle {
    dataSource?: TokenRate[];
}

const RainbowBar = (props: RainbowBarProps) => {
    const { dataSource, width, height } = props;

    return (
        <div className="rainbow-progress-bar">
            <div
                style={{ width: `${width}px`, height: `${height}px` }}
                className="progress-bar-wrapper"
            >
                {dataSource.map((item) => (
                    <div
                        key={item.token}
                        style={{ width: `${item.rate * 100}%` }}
                        className={`progress-move-bar bar-${item.token.toLowerCase()}`}
                    />
                ))}
            </div>
        </div>
    );
};

RainbowBar.defaultProps = {
    dataSource: [
        {
            token: 'usdt',
            rate: 3 / 10,
        },
        {
            token: 'usdc',
            rate: 7 / 10,
        },
    ],
    width: 720,
    height: 8,
};

export default RainbowBar;
