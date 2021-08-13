import React from 'react';
import './Button.less';
import classNames from 'classnames';
// import { MouseEventHandler } from 'react';
import { ScaleGroupContext } from './Group';
import { useContext } from 'react';

export interface IScaleOption {
    [x: string]: React.ReactNode | keyof HTMLElementTagNameMap;
    value: any;
    disabled?: boolean;
    onClick?: Function;
}

export default (props: IScaleOption) => {
    const { value, disabled, children, onClick } = props;

    const { currentValue, onChange } = useContext(ScaleGroupContext);

    return (
        <button
            className={classNames({
                'btn-scale': true,
                active: currentValue === value,
            })}
            key={value}
            disabled={disabled}
            onClick={(e) => {
                onChange(e, value);
                onClick && onClick(value);
            }}
        >
            {children}
        </button>
    );
};
