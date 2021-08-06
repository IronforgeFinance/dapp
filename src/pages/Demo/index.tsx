import React, { useState } from 'react';
import './index.less';
import SelectTokens from '../../components/SelectTokens';

export default () => {
    // * 选择token演示
    const SelectTokensDemo = () => {
        const [showSetting, setShowSetting] = useState(false);

        return (
            <SelectTokens
                visable={showSetting}
                onClose={() => setShowSetting(false)}
            >
                <button
                    className="btn-select-tokens"
                    onClick={() => setShowSetting(true)}
                >
                    Select Tokens
                </button>
            </SelectTokens>
        );
    };

    return (
        <div className="demo-container">
            <ul>
                <li>
                    <h3>1. select token list</h3>
                    <SelectTokensDemo />
                </li>
            </ul>
        </div>
    );
};
