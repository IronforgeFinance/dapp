import React from 'react';

interface IsShowProps {
    condition?: boolean;
    children?: React.ReactNode;
}

const IsShow = (props: IsShowProps) => {
    const { condition, children } = props;

    return <div style={condition ? {} : { display: 'none' }}>{children}</div>;
};

IsShow.defaultProps = {
    condition: true,
};

export default IsShow;
