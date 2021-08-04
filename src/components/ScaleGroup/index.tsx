import React, { useMemo } from 'react';
import './index.less';
import classNames from 'classnames';

export interface IScaleGroup {
    defaultValue?: string;
    value?: string;
    scaleRange?: string[];
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
                        active: value == scale,
                    })}
                    key={scale}
                    onClick={updateScale.bind(this, scale)}
                >
                    {scale}
                </button>
            ))}
        </div>
    );
};
