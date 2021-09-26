import './WalletIcon.pc.less';
import './WalletIcon.mobile.less';

import React from 'react';
import { IconProps } from './index';

interface WalletIconProps extends IconProps {
    name: string;
    // isTokenPair?: boolean;
}

const WalletIcon = (props: WalletIconProps) => {
    const { size, name = '', style } = props;

    const sizeStyle = React.useMemo(() => {
        return { width: `${size}px`, height: `${size}px` };
    }, [size]);

    return (
        <i
            className={`wallet-icon ${name.toLowerCase()}`}
            style={{ ...sizeStyle, ...style }}
        />
    );
};

WalletIcon.defaultProps = {
    size: 24,
    style: {},
};

export default WalletIcon;
