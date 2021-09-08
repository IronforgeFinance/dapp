import './less/TokenIcon/index.less';

import React from 'react';
import { IconProps } from './index';

interface TokenIconProps extends IconProps {
    name: string;
    // isTokenPair?: boolean;
}

const tokenRegex = /^[a-zA-Z]+$/;

const TokenIcon = (props: TokenIconProps) => {
    const { size, name = '', style } = props;

    const sizeStyle = React.useMemo(() => {
        return { width: `${size}px`, height: `${size}px` };
    }, [size]);

    const isTokenPair = React.useMemo(() => {
        const nameArray = name.split('-');
        if (nameArray.length > 1) {
            return (
                tokenRegex.test(nameArray[0]) && tokenRegex.test(nameArray[1])
            );
        }

        return false;
    }, [name]);

    const tokenPair = React.useMemo(() => {
        const tokens = name.split('-');
        return {
            token0: tokens[0] || '',
            token1: tokens[1] || '',
        };
    }, [isTokenPair]);

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
    style: {},
};

export default TokenIcon;
