'use strict';
exports.__esModule = true;
var react_1 = require('react');
require('./index.less');
var Board_1 = require('@/components/Board');
var DEFAULT_CURRENCY_SYMBOL = '$';
function TransitionConfirm(props) {
    var visable = props.visable,
        _onClose = props.onClose,
        dataSource = props.dataSource;
    return react_1['default'].createElement(
        Board_1['default'],
        { visable: visable, onClose: _onClose, title: 'Confirm Transaction' },
        react_1['default'].createElement(
            'ul',
            { className: 'confirm-infos' },
            dataSource.map(function (prop) {
                return react_1['default'].createElement(
                    'li',
                    { key: prop.label, className: 'info' },
                    react_1['default'].createElement(
                        'span',
                        { className: 'label' },
                        prop.label,
                    ),
                    react_1['default'].createElement(
                        'div',
                        { className: 'value' },
                        typeof prop.value === 'string' &&
                            react_1['default'].createElement(
                                'span',
                                { className: 'token' },
                                prop.value,
                            ),
                        typeof prop.value === 'object' &&
                            react_1['default'].createElement(
                                react_1['default'].Fragment,
                                null,
                                react_1['default'].createElement(
                                    'span',
                                    { className: 'token' },
                                    prop.value.amount,
                                    ' ',
                                    prop.value.token,
                                ),
                                react_1['default'].createElement(
                                    'span',
                                    { className: 'dollar' },
                                    prop.value.symbol ||
                                        DEFAULT_CURRENCY_SYMBOL,
                                    prop.value.mappingPrice,
                                ),
                            ),
                    ),
                );
            }),
        ),
    );
}
exports['default'] = TransitionConfirm;
