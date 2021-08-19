import React from 'react';
import './TokenIcon.less';
import { IconProps } from './index';

interface TokenIconProps extends IconProps {
    name: string;
    isTokenPair?: boolean;
}

const TokenIcon = (props: TokenIconProps) => {
    const { size, name = '', style, isTokenPair } = props;

    const sizeStyle = React.useMemo(() => {
        return { width: `${size}px`, height: `${size}px` };
    }, [size]);

    const tokenPair = React.useMemo(() => {
        const tokens = name.split('-');
        return {
            token0: tokens[0] || '',
            token1: tokens[1] || '',
        };
    }, [isTokenPair, name]);

    return (
        <React.Fragment>
            {isTokenPair && tokenPair.token0 && tokenPair.token1 && (
                <div className="token-icon-pair">
                    <i
                        className={`token-icon ${tokenPair.token0.toLowerCase()}`}
                        style={{ ...sizeStyle, ...style }}
                    />
                    <i
                        className={`token-icon ${tokenPair.token1.toLowerCase()}`}
                        style={{ ...sizeStyle, ...style }}
                    />
                </div>
            )}
            {!isTokenPair && name && (
                <i
                    className={`token-icon ${name.toLowerCase()}`}
                    style={{ ...sizeStyle, ...style }}
                />
            )}
        </React.Fragment>
    );
};

TokenIcon.defaultProps = {
    size: 24,
    isTokenPair: false,
    style: {},
};

export default TokenIcon;
