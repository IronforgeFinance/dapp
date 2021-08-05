import React, { useMemo } from 'react';
import './index.less';
import classNames from 'classnames';

export interface IScaleOption {
    label: string;
    value: any;
}
export interface IScaleGroup {
    defaultValue?: string;
    value?: string;
    scaleRange?: IScaleOption[];
    updateScale?: Function;
}

export default (props: IScaleGroup) => {
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
                >
                    {scale.label}
                </button>
            ))}
        </div>
    );
};
