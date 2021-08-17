import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import './index.less';

interface TabOption {
    name: string;
    key: string | number;
}

interface TabGroupProps {
    items: TabOption[];
    value: string | number;
    onChange: Function;
}

export default (props: TabGroupProps) => {
    const { items = [], value, onChange } = props;

    const _changeTab = useCallback((key) => onChange(key), []);

    return (
        <div className="tab-group">
            {items.map((item) => {
                return (
                    <button
                        key={item.key}
                        className={classNames({
                            'tab-btn': true,
                            active: value === item.key,
                        })}
                        onClick={_changeTab.bind(this, item.key)}
                    >
                        {item.name}
                    </button>
                );
            })}
        </div>
    );
};
