import React, { useMemo } from 'react';
import './index.less';
import classNames from 'classnames';

export interface IScaleOption {
    label: string;
    value: any;
    disabled?: boolean;
}
export interface IScaleGroupProps {
    defaultValue?: string;
    value?: any;
    scaleRange?: IScaleOption[];
    updateScale?: Function;
}

export default (props: IScaleGroupProps) => {
    const { scaleRange = [], value = '', updateScale = () => {} } = props;

    return (
        <div className="group-scale">
            {scaleRange.map((scale) => (
                <button
                    className={classNames({
                        'btn-scale': true,
                        active: value == scale.value,
                    })}
                    key={scale.value}
                    onClick={updateScale.bind(this, scale.value)}
                    disabled={scale.disabled}
                >
                    {scale.label}
                </button>
            ))}
        </div>
    );
};
