import React from 'react';
import './Group.less';
import { useCallback } from 'react';
import { IScaleOption } from './Button';

export interface IScaleGroupContextProps {
    onChange: (e, scale: IScaleOption) => void;
    currentValue?: string;
}

export const ScaleGroupContext = React.createContext<IScaleGroupContextProps | null>(
    null,
);

export interface IScaleGroupProps {
    value?: any;
    updateScale?: Function;
    children?: React.ReactNode | keyof HTMLElementTagNameMap;
}

export default (props: IScaleGroupProps) => {
    const { value = '', updateScale = () => {}, children } = props;

    const _onUpdate = useCallback(
        (e, newValue) => {
            e.stopPropagation();

            if (value === newValue) return;

            updateScale(newValue);
        },
        [value],
    );

    return (
        <ScaleGroupContext.Provider
            value={{ onChange: _onUpdate, currentValue: value }}
        >
            <div className="group-scale">{children}</div>
        </ScaleGroupContext.Provider>
    );
};
