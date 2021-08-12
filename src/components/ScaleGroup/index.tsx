import React, { useMemo } from 'react';
import './index.less';
import classNames from 'classnames';
import { useCallback } from 'react';

export interface IScaleOption {
    label: string;
    value: any;
    disabled?: boolean;
    onClick?: Function;
}
export interface IScaleGroupProps {
    defaultValue?: string;
    value?: any;
    scaleRange?: IScaleOption[];
    updateScale?: Function;
}

export default (props: IScaleGroupProps) => {
    const { scaleRange = [], value = '', updateScale = () => {} } = props;

    const _onUpdate = useCallback(
        (e, scale) => {
            e.stopPropagation();

            if (scale.value === value) return;

            updateScale(scale.value);
            scale.onClick(scale.value);
        },
        [value],
    );

    return (
        <div className="group-scale">
            {scaleRange.map((scale) => (
                <button
                    className={classNames({
                        'btn-scale': true,
                        active: value == scale.value,
                    })}
                    key={scale.value}
                    onClick={(e) => _onUpdate(e, scale)}
                    disabled={scale.disabled}
                >
                    {scale.label}
                </button>
            ))}
        </div>
    );
};
