'use strict';
exports.__esModule = true;
var react_1 = require('react');
require('./index.less');
var classnames_1 = require('classnames');
function instanceOfAddress(object) {
    return 'address' in object;
}
function instanceOfPrice(object) {
    return 'amount' in object;
}
var DEFAULT_CURRENCY_SYMBOL = '$';
var MarketDetail = function (props) {
    var _a = react_1['default'].useState(false),
        toggle = _a[0],
        setToggle = _a[1];
    return react_1['default'].createElement(
        'div',
        {
            className: classnames_1['default']({
                'market-details': true,
                hide: toggle,
                show: !toggle,
            }),
        },
        react_1['default'].createElement('button', {
            className: 'btn-skip',
            onClick: function () {
                return setToggle(!toggle);
            },
        }),
        react_1['default'].createElement(
            'div',
            { className: 'head' },
            react_1['default'].createElement(
                'p',
                { className: 'details' },
                'Market Details:',
                ' ',
                react_1['default'].createElement(
                    'span',
                    { className: 'token-pair' },
                    props.token0,
                    '/',
                    props.token1,
                ),
            ),
            react_1['default'].createElement(
                'span',
                { className: 'token0' },
                props.token0,
            ),
        ),
        react_1['default'].createElement(
            'div',
            { className: 'main' },
            react_1['default'].createElement(
                'ul',
                { className: 'props' },
                props.dataSource.map(function (prop) {
                    return react_1['default'].createElement(
                        'li',
                        { className: 'prop' },
                        react_1['default'].createElement(
                            'span',
                            { className: 'label' },
                            prop.label,
                        ),
                        instanceOfAddress(prop.value) &&
                            react_1['default'].createElement(
                                'span',
                                { className: 'value address' },
                                prop.value.address.replace(
                                    /^(0x[\d\w]{4}).*([\d\w]{4})$/,
                                    '$1...$2',
                                ),
                            ),
                        instanceOfPrice(prop.value) &&
                            react_1['default'].createElement(
                                'span',
                                { className: 'value price' },
                                prop.value.symbol || DEFAULT_CURRENCY_SYMBOL,
                                prop.value.amount,
                            ),
                    );
                }),
            ),
        ),
    );
};
exports['default'] = MarketDetail;
