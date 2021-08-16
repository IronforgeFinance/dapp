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
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
        });
    };
var __generator =
    (this && this.__generator) ||
    function (thisArg, body) {
        var _ = {
                label: 0,
                sent: function () {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: [],
            },
            f,
            y,
            t,
            g;
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function () {
                    return this;
                }),
            g
        );
        function verb(n) {
            return function (v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) throw new TypeError('Generator is already executing.');
            while (_)
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y['return']
                                    : op[0]
                                    ? y['throw'] ||
                                      ((t = y['return']) && t.call(y), 0)
                                    : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t;
                    if (((y = 0), t)) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (
                                !((t = _.trys),
                                (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0;
                                continue;
                            }
                            if (
                                op[0] === 3 &&
                                (!t || (op[1] > t[0] && op[1] < t[3]))
                            ) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
exports.__esModule = true;
var react_1 = require('react');
var useContract_1 = require('@/hooks/useContract');
var core_1 = require('@web3-react/core');
var ethers_1 = require('ethers');
var bigNumber_1 = require('@/utils/bigNumber');
var antd_1 = require('antd');
var config_1 = require('@/config');
var useTokenBalance_1 = require('@/hooks/useTokenBalance');
require('./index.less');
var contracts_1 = require('@/config/constants/contracts');
var SelectTokens_1 = require('@/components/SelectTokens');
var MarketDetail_1 = require('./MarketDetail');
var lodash_1 = require('lodash');
var classnames_1 = require('classnames');
//TODO: for test.从配置中读取
var TOKEN_OPTIONS = [
    { name: 'lBTC-202112' },
    { name: 'FUSD' },
    { name: 'lBTC' },
];
exports['default'] = function () {
    var configContract = useContract_1.useConfig();
    var exchangeSystem = useContract_1.useExchangeSystem();
    var account = core_1.useWeb3React().account;
    var _a = react_1.useState(TOKEN_OPTIONS[0].name),
        fromToken = _a[0],
        setFromToken = _a[1];
    var _b = react_1.useState(0.0),
        fromAmount = _b[0],
        setFromAmount = _b[1];
    var _c = react_1.useState(TOKEN_OPTIONS[1].name),
        toToken = _c[0],
        setToToken = _c[1];
    var _d = react_1.useState(0.0),
        toAmount = _d[0],
        setToAmount = _d[1];
    var _e = react_1.useState(0.0),
        fromBalance = _e[0],
        setFromBalance = _e[1];
    var _f = react_1.useState(false),
        submitting = _f[0],
        setSubmitting = _f[1];
    var _g = react_1.useState(0),
        feeRate = _g[0],
        setFeeRate = _g[1];
    var _h = react_1.useState(0),
        estimateAmount = _h[0],
        setEstimateAmount = _h[1];
    var _j = react_1.useState(false),
        showSelectFromToken = _j[0],
        setShowSelectFromToken = _j[1];
    var _k = react_1.useState(false),
        showSelectToToken = _k[0],
        setShowSelectToToken = _k[1];
    var prices = useContract_1.usePrices();
    var fromTokenBalance = useTokenBalance_1.useBep20Balance(fromToken).balance;
    var toTokenBalance = useTokenBalance_1.useBep20Balance(toToken).balance;
    var getTokenPrice = function (token) {
        return __awaiter(void 0, void 0, void 0, function () {
            var res, val, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!token) return [2 /*return*/, 0];
                        return [
                            4 /*yield*/,
                            prices.getPrice(
                                ethers_1.ethers.utils.formatBytes32String(
                                    token,
                                ),
                            ),
                        ];
                    case 1:
                        res = _a.sent();
                        val = parseFloat(
                            ethers_1.ethers.utils.formatEther(res),
                        );
                        if (val === 0) {
                            throw new Error('Wrong token price: ' + token);
                        }
                        return [2 /*return*/, val];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 3];
                    case 3:
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    var getFeeRate = function () {
        return __awaiter(void 0, void 0, void 0, function () {
            var res, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!toToken) return [3 /*break*/, 2];
                        return [
                            4 /*yield*/,
                            configContract.getUint(
                                ethers_1.ethers.utils.formatBytes32String(
                                    toToken,
                                ),
                            ),
                        ];
                    case 1:
                        res = _a.sent();
                        value = ethers_1.ethers.utils.formatUnits(res, 18);
                        console.log('feeRate: ', value);
                        setFeeRate(parseFloat(value));
                        _a.label = 2;
                    case 2:
                        return [2 /*return*/];
                }
            });
        });
    };
    var getTradeSettlementDelay = function () {
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [
                            4 /*yield*/,
                            configContract.getUint(
                                ethers_1.ethers.utils.formatBytes32String(
                                    'TradeSettlementDelay',
                                ),
                            ),
                        ];
                    case 1:
                        res = _a.sent();
                        console.log('getTradeSettlementDelay', res.toNumber());
                        return [2 /*return*/];
                }
            });
        });
    };
    var getRevertDelay = function () {
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [
                            4 /*yield*/,
                            configContract.getUint(
                                ethers_1.ethers.utils.formatBytes32String(
                                    'TradeRevertDelay',
                                ),
                            ),
                        ];
                    case 1:
                        res = _a.sent();
                        console.log('getRevertDelay', res.toNumber());
                        return [2 /*return*/];
                }
            });
        });
    };
    react_1.useEffect(
        function () {
            getFeeRate();
        },
        [configContract, toToken],
    );
    var computeToAmount = lodash_1.debounce(function () {
        return __awaiter(void 0, void 0, void 0, function () {
            var fromTokenPrice, toTokenPrice, val, toAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, getTokenPrice(fromToken)];
                    case 1:
                        fromTokenPrice = _a.sent();
                        return [4 /*yield*/, getTokenPrice(toToken)];
                    case 2:
                        toTokenPrice = _a.sent();
                        val = (fromTokenPrice * fromAmount) / toTokenPrice;
                        toAmount = bigNumber_1.toFixedWithoutRound(val, 2);
                        setToAmount(parseFloat(toAmount));
                        return [2 /*return*/];
                }
            });
        });
    }, 500);
    react_1.useEffect(
        function () {
            computeToAmount();
        },
        [fromToken, fromAmount, toToken],
    );
    var computeEstimateAmount = lodash_1.debounce(function () {
        return __awaiter(void 0, void 0, void 0, function () {
            var fromTokenPrice, toTokenPrice, val, amount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, getTokenPrice(fromToken)];
                    case 1:
                        fromTokenPrice = _a.sent();
                        return [4 /*yield*/, getTokenPrice(toToken)];
                    case 2:
                        toTokenPrice = _a.sent();
                        val =
                            (fromTokenPrice * fromAmount * (1 - feeRate)) /
                            toTokenPrice;
                        amount = parseFloat(
                            bigNumber_1.toFixedWithoutRound(val, 6),
                        );
                        setEstimateAmount(amount);
                        return [2 /*return*/];
                }
            });
        });
    }, 500);
    react_1.useEffect(
        function () {
            computeEstimateAmount();
        },
        [feeRate, fromAmount, fromToken, toToken],
    );
    var fromAmountHandler = function (v) {
        setFromAmount(v);
    };
    var toAmountHandler = lodash_1.debounce(function (v) {
        if (v && toToken) {
            var _amount =
                (config_1.TokenPrices[toToken] * v) /
                config_1.TokenPrices[fromToken];
            if (_amount > parseFloat(fromTokenBalance)) {
                antd_1.message.error(
                    'From token balance is not enough. Need ' +
                        _amount +
                        ' ' +
                        fromToken,
                );
                setToAmount(0);
                return;
            }
            setToAmount(v);
        }
    }, 500);
    var settleTrade = function (entryId) {
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, exchangeSystem.settle(entryId)];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [2 /*return*/];
                }
            });
        });
    };
    // 超时的只能revert
    var revertTrade = function (entryId) {
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [
                            4 /*yield*/,
                            exchangeSystem.revertPendingExchange(entryId),
                        ];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [2 /*return*/];
                }
            });
        });
    };
    var onSubmit = function () {
        return __awaiter(void 0, void 0, void 0, function () {
            var tx, receipt, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // await revertTrade(3);
                        // await revertTrade(4);
                        // return;
                        if (!fromAmount || !toAmount) {
                            antd_1.message.warning(
                                'From amount and to amount are required',
                            );
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        setSubmitting(true);
                        return [
                            4 /*yield*/,
                            exchangeSystem.exchange(
                                ethers_1.ethers.utils.formatBytes32String(
                                    fromToken,
                                ), // sourceKey
                                bigNumber_1.expandTo18Decimals(fromAmount), // sourceAmount
                                account, // destAddr
                                ethers_1.ethers.utils.formatBytes32String(
                                    toToken,
                                ),
                            ),
                        ];
                    case 2:
                        tx = _a.sent();
                        antd_1.message.info(
                            'Trade tx sent out successfully. Pls wait for a while......',
                        );
                        return [4 /*yield*/, tx.wait()];
                    case 3:
                        receipt = _a.sent();
                        console.log(receipt);
                        handleTxReceipt(receipt);
                        setSubmitting(false);
                        antd_1.message.success(
                            'Tx confirmed. Pls wait for the delay and then check your balance.',
                        );
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        setSubmitting(false);
                        console.log(err_1);
                        return [3 /*break*/, 5];
                    case 5:
                        return [2 /*return*/];
                }
            });
        });
    };
    //TODO to be removed
    var handleTxReceipt = function (receipt) {
        getTradeSettlementDelay();
        getRevertDelay();
        var exchangeContract =
            contracts_1['default'].ExchangeSystem[process.env.APP_CHAIN_ID];
        var _loop_1 = function (event) {
            if (event.address === exchangeContract) {
                var lastEntryId_1 = event.args[0].toNumber();
                console.log('>>> lastEntryId <<<', lastEntryId_1);
                setTimeout(function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                        var err_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [
                                        4 /*yield*/,
                                        settleTrade(lastEntryId_1),
                                    ];
                                case 1:
                                    _a.sent();
                                    antd_1.message.success(
                                        'Trade has been settled.Pls check your balance',
                                    );
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_2 = _a.sent();
                                    setTimeout(function () {
                                        return __awaiter(
                                            void 0,
                                            void 0,
                                            void 0,
                                            function () {
                                                return __generator(
                                                    this,
                                                    function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                return [
                                                                    4 /*yield*/,
                                                                    revertTrade(
                                                                        lastEntryId_1,
                                                                    ),
                                                                ];
                                                            case 1:
                                                                _a.sent();
                                                                antd_1.message.error(
                                                                    'Trade has been reverted. Pls try again.',
                                                                );
                                                                return [
                                                                    2 /*return*/,
                                                                ];
                                                        }
                                                    },
                                                );
                                            },
                                        );
                                    }, 60000);
                                    console.log(err_2);
                                    return [3 /*break*/, 3];
                                case 3:
                                    return [2 /*return*/];
                            }
                        });
                    });
                }, 6000); // 合约目前设置的delay是6秒,revert delay 是1min。
            }
        };
        for (var _i = 0, _a = receipt.events; _i < _a.length; _i++) {
            var event = _a[_i];
            _loop_1(event);
        }
    };
    var WhiteSpace = function () {
        return react_1['default'].createElement('span', {
            dangerouslySetInnerHTML: {
                __html: '&nbsp;',
            },
        });
    };
    var hasInputtedAmount = react_1.useMemo(
        function () {
            return fromAmount > 0 || toAmount > 0;
        },
        [fromAmount, toAmount],
    );
    var mockMarketDetailData = {
        token0: 'fBTC',
        token1: 'fETH',
        dataSource: [
            { label: '24H volume', value: { amount: 6668.15 } },
            { label: 'Market Cap', value: { amount: 6668.15 } },
            { label: '24H High', value: { amount: 558.15 } },
            { label: '24H Low', value: { amount: 6668.15 } },
            {
                label: 'Price Feed',
                value: {
                    address: '0xDD21D68304503Efe46be7eCe376afaC77C8067c8',
                },
            },
            {
                label: 'fBTC Contract',
                value: {
                    address: '0xDD21D68304503Efe46be7eCe376afaC77C8067c8',
                },
            },
        ],
    };
    return react_1['default'].createElement(
        'div',
        { className: 'trade-container' },
        react_1['default'].createElement(
            'div',
            { className: 'shop common-box' },
            react_1['default'].createElement('div', { className: 'roof' }),
            react_1['default'].createElement('div', {
                className: classnames_1['default']({
                    sign: true,
                    active: hasInputtedAmount,
                }),
            }),
            react_1['default'].createElement(
                'div',
                { className: 'form' },
                react_1['default'].createElement(
                    'div',
                    { className: 'input-item' },
                    react_1['default'].createElement(
                        'p',
                        { className: 'label' },
                        'From',
                    ),
                    react_1['default'].createElement(
                        'div',
                        { className: 'input-item-content' },
                        react_1['default'].createElement(
                            'div',
                            { className: 'content-label' },
                            react_1['default'].createElement('p', {
                                className: 'left',
                            }),
                            react_1['default'].createElement(
                                'p',
                                { className: 'right' },
                                'Balance:',
                                react_1['default'].createElement(
                                    WhiteSpace,
                                    null,
                                ),
                                react_1['default'].createElement(
                                    'span',
                                    { className: 'balance' },
                                    fromTokenBalance,
                                ),
                            ),
                        ),
                        react_1['default'].createElement(
                            'div',
                            { className: 'input' },
                            react_1['default'].createElement(
                                antd_1.InputNumber,
                                {
                                    value: fromAmount,
                                    onChange: fromAmountHandler,
                                    placeholder: '0.00',
                                    className: 'custom-input',
                                    min: 0,
                                },
                            ),
                            react_1['default'].createElement(
                                'div',
                                { className: 'token' },
                                react_1['default'].createElement(
                                    SelectTokens_1['default'],
                                    {
                                        visable: showSelectFromToken,
                                        value: fromToken,
                                        tokenList: TOKEN_OPTIONS,
                                        onSelect: function (v) {
                                            return setFromToken(v);
                                        },
                                        onClose: function () {
                                            setShowSelectFromToken(false);
                                        },
                                    },
                                    react_1['default'].createElement(
                                        'button',
                                        {
                                            className: 'btn-mint-form',
                                            onClick: function () {
                                                setShowSelectFromToken(true);
                                            },
                                        },
                                        react_1['default'].createElement(
                                            'span',
                                            null,
                                            fromToken ||
                                                react_1[
                                                    'default'
                                                ].createElement(
                                                    'span',
                                                    null,
                                                    'Select token',
                                                ),
                                        ),
                                        react_1['default'].createElement('i', {
                                            className: 'icon-down size-20',
                                        }),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
                react_1['default'].createElement(
                    'div',
                    { className: 'input-item' },
                    react_1['default'].createElement(
                        'p',
                        { className: 'label' },
                        'To',
                    ),
                    react_1['default'].createElement(
                        'div',
                        { className: 'input-item-content' },
                        react_1['default'].createElement(
                            'div',
                            { className: 'content-label' },
                            react_1['default'].createElement('p', {
                                className: 'left',
                            }),
                            react_1['default'].createElement(
                                'p',
                                { className: 'right' },
                                'Balance:',
                                ' ',
                                react_1['default'].createElement(
                                    'span',
                                    { className: 'balance' },
                                    toTokenBalance,
                                ),
                            ),
                        ),
                        react_1['default'].createElement(
                            'div',
                            { className: 'input' },
                            react_1['default'].createElement(
                                antd_1.InputNumber,
                                {
                                    value: toAmount,
                                    onChange: toAmountHandler,
                                    placeholder: '0.00',
                                    className: 'custom-input',
                                    disabled: !toToken,
                                    min: 0,
                                },
                            ),
                            react_1['default'].createElement(
                                'div',
                                { className: 'token' },
                                react_1['default'].createElement(
                                    SelectTokens_1['default'],
                                    {
                                        visable: showSelectToToken,
                                        value: toToken,
                                        tokenList: TOKEN_OPTIONS,
                                        onSelect: function (v) {
                                            return setToToken(v);
                                        },
                                        onClose: function () {
                                            setShowSelectToToken(false);
                                        },
                                    },
                                    react_1['default'].createElement(
                                        'button',
                                        {
                                            className: 'btn-mint-form',
                                            onClick: function () {
                                                setShowSelectToToken(true);
                                            },
                                        },
                                        react_1['default'].createElement(
                                            'span',
                                            null,
                                            toToken ||
                                                react_1[
                                                    'default'
                                                ].createElement(
                                                    'span',
                                                    null,
                                                    'Select token',
                                                ),
                                        ),
                                        react_1['default'].createElement('i', {
                                            className: 'icon-down size-20',
                                        }),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
                react_1['default'].createElement(
                    antd_1.Button,
                    {
                        className: 'btn-trade common-btn common-btn-red',
                        onClick: onSubmit,
                        loading: submitting,
                    },
                    'Trade',
                ),
                react_1['default'].createElement(
                    'span',
                    { className: 'fee-cost' },
                    'Fee cost\uFF1A0',
                ),
            ),
        ),
        react_1['default'].createElement(
            MarketDetail_1['default'],
            __assign({}, mockMarketDetailData),
        ),
    );
};
