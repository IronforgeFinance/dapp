'use strict';
var __assign =
    (this && this.__assign) ||
    function () {
        __assign =
            Object.assign ||
            function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s)
                        if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
exports.__esModule = true;
var react_1 = require('react');
require('./index.less');
var SelectTokens_1 = require('@/components/SelectTokens');
var CommentaryCard_1 = require('@/components/CommentaryCard');
var DebtItemRatio_1 = require('@/components/DebtItemRatio');
var DebtItem_1 = require('@/components/DebtItem');
var Notification_1 = require('@/components/Notification');
var Popover_1 = require('@/components/Popover');
var TransitionConfirm_1 = require('@/components/TransitionConfirm');
exports['default'] = function () {
    // * 选择token演示
    var SelectTokensDemo = function () {
        var _a = react_1.useState(false),
            showSetting = _a[0],
            setShowSetting = _a[1];
        return react_1['default'].createElement(
            SelectTokens_1['default'],
            {
                visable: showSetting,
                onClose: function () {
                    return setShowSetting(false);
                },
            },
            react_1['default'].createElement(
                'button',
                {
                    className: 'btn-select-tokens',
                    onClick: function () {
                        return setShowSetting(true);
                    },
                },
                'Click Select Tokens',
            ),
        );
    };
    // * 债务比率显示
    var DebtItemRatioDemo = function () {
        // const mockDebtRatios = [
        //     {
        //         token: 'BTC',
        //         percent: '49%',
        //     },
        //     {
        //         token: 'USDT',
        //         percent: '31%',
        //     },
        //     {
        //         token: 'ETH',
        //         percent: '12%',
        //     },
        //     {
        //         token: 'TOKEN1',
        //         percent: '6%',
        //     },
        //     {
        //         token: 'TOKEN2',
        //         percent: '2%',
        //     },
        // ];
        var mockDebtRatios = [
            {
                token: 'BTC',
                percent: '69%',
            },
            {
                token: 'USDT',
                percent: '31%',
            },
        ];
        return react_1['default'].createElement(DebtItemRatio_1['default'], {
            debtRatios: mockDebtRatios,
        });
    };
    var TransitionConfirmDemo = function () {
        var _a = react_1.useState(false),
            visable = _a[0],
            setVisable = _a[1];
        return react_1['default'].createElement(
            'div',
            { className: 'transition-confirm-demo' },
            react_1['default'].createElement(TransitionConfirm_1['default'], {
                visable: visable,
                onClose: function () {
                    return setVisable(false);
                },
                dataSource: [
                    {
                        label: 'Collateral',
                        value: {
                            token: 'BNB',
                            amount: 20,
                            mappingPrice: 6162.8,
                        },
                    },
                    {
                        label: 'Minted',
                        value: {
                            token: 'fETH',
                            amount: 5,
                            mappingPrice: 6162.8,
                        },
                    },
                    {
                        label: 'Locked',
                        value: {
                            token: 'ftoken',
                            amount: 0,
                            mappingPrice: 6162.8,
                        },
                    },
                    { label: 'Type', value: 'Delivery' },
                ],
            }),
            react_1['default'].createElement(
                'button',
                {
                    onClick: function () {
                        return setVisable(true);
                    },
                },
                'Test TransitionConfirm',
            ),
        );
    };
    // * 每一项债务数据
    var DebtItemDemo = function () {
        var mockDebts = {
            balance: 88888,
            mintedToken: 'fUSD',
            mintedTokenName: 'USD',
            mintedTokenNum: 100,
            debtRatios: [
                {
                    token: 'BTC',
                    percent: '49%',
                },
                {
                    token: 'USDT',
                    percent: '31%',
                },
                {
                    token: 'ETH',
                    percent: '12%',
                },
                {
                    token: 'TOKEN1',
                    percent: '6%',
                },
                {
                    token: 'TOKEN2',
                    percent: '2%',
                },
            ],
            fusdBalance: 10000,
        };
        return react_1['default'].createElement(
            DebtItem_1['default'],
            __assign({}, mockDebts),
        );
    };
    return react_1['default'].createElement(
        'div',
        { className: 'demo-container' },
        react_1['default'].createElement(
            'ul',
            null,
            react_1['default'].createElement(
                'li',
                null,
                react_1['default'].createElement(
                    'h3',
                    null,
                    '3. \u89E3\u8BF4\u724C',
                ),
                react_1['default'].createElement(CommentaryCard_1['default'], {
                    title: 'Begin To Mint',
                    description:
                        'Mint fUSD by staking your Token. Token stakers earn weekly staking rewards .',
                }),
            ),
            react_1['default'].createElement(
                'li',
                null,
                react_1['default'].createElement(
                    'h3',
                    null,
                    '4. \u503A\u52A1\u9879\u8FDB\u5EA6\u6761',
                ),
                react_1['default'].createElement(DebtItemRatioDemo, null),
            ),
            react_1['default'].createElement(
                'li',
                null,
                react_1['default'].createElement(
                    'h3',
                    null,
                    '5. \u503A\u52A1\u9879',
                ),
                react_1['default'].createElement(DebtItemDemo, null),
            ),
            react_1['default'].createElement(
                'li',
                null,
                react_1['default'].createElement(
                    'h3',
                    null,
                    '5. \u6210\u529F\u901A\u77E5',
                ),
                react_1['default'].createElement(
                    'button',
                    {
                        onClick: function () {
                            return Notification_1.success({
                                message: 'Transaction receipt',
                                description: 'Mint fUSD from USDC',
                                showView: true,
                            });
                        },
                    },
                    '\u6210\u529F',
                ),
                react_1['default'].createElement(
                    'button',
                    {
                        onClick: function () {
                            return Notification_1.fail({
                                message: 'Transaction receipt',
                                description: 'Mint fUSD from USDC',
                            });
                        },
                    },
                    '\u5931\u8D25',
                ),
            ),
            react_1['default'].createElement(
                'li',
                null,
                react_1['default'].createElement('h3', null, '6. Popover'),
                react_1['default'].createElement(
                    Popover_1['default'],
                    { content: 'Fuck Qsk!!!!' },
                    react_1['default'].createElement(
                        'button',
                        null,
                        'Open Popover',
                    ),
                ),
            ),
            react_1['default'].createElement(
                'li',
                null,
                react_1['default'].createElement(
                    'h3',
                    null,
                    '7. Transition Confirm',
                ),
                react_1['default'].createElement(TransitionConfirmDemo, null),
            ),
        ),
    );
};
