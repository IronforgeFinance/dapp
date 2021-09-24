import './pc.less';
import './mobile.less';

import { useLayoutEffect } from 'react';
import { Switch, SwitchProps } from 'antd';
import classNames from 'classnames';

// var addRule = (function (style) {
//     var sheet = document.head.appendChild(style).sheet;
//     return function (selector, css) {
//         var propText =
//             typeof css === 'string'
//                 ? css
//                 : Object.keys(css)
//                       .map(function (p) {
//                           return (
//                               p +
//                               ':' +
//                               (p === 'content' ? "'" + css[p] + "'" : css[p])
//                           );
//                       })
//                       .join(';');
//         sheet.insertRule(
//             selector + '{' + propText + '}',
//             sheet.cssRules.length,
//         );
//     };
// })(document.createElement('style'));

export interface ISwitchProps {
    className?: string;
    unCheckedChildren: string;
    checkedChildren: string;
    checked: boolean;
    onChange(boolean?): void;
}

const ISwitch = (props: ISwitchProps) => {
    const { unCheckedChildren, checkedChildren, checked, onChange, className } =
        props;

    // useLayoutEffect(() => {
    //     addRule('.iswitch.ant-switch .ant-switch-handle::before', {
    //         content: unCheckedChildren,
    //     });
    // }, [unCheckedChildren]);

    // return <Switch {...props} className="iswitch" />;

    return (
        <div className={`${className ?? ''} iron-switch`}>
            <button
                onClick={() => onChange(true)}
                className={classNames({
                    active: checked,
                })}
            >
                <span>{checkedChildren}</span>
            </button>
            <button
                onClick={() => onChange(false)}
                className={classNames({
                    active: !checked,
                })}
            >
                <span>{unCheckedChildren}</span>
            </button>
        </div>
    );
};

ISwitch.defaultProps = {
    checked: true,
};

export default ISwitch;
