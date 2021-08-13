import React from 'react';
import './index.less';
import { ReactComponent as TabBackIcon01 } from '@/assets/images/big-board-svg-01.svg';
import { ReactComponent as TabBackIcon02 } from '@/assets/images/big-board-svg-02.svg';
import { ReactComponent as TabBackIcon03 } from '@/assets/images/big-board-svg-03.svg';
import { ReactComponent as TabBackIcon04 } from '@/assets/images/big-board-svg-04.svg';
import classNames from 'classnames';
import { useCallback } from 'react';

const svgs = [
    <TabBackIcon01 fill="#89512D" />,
    <TabBackIcon02 fill="#89512D" />,
    <TabBackIcon03 fill="#89512D" />,
    <TabBackIcon04 fill="#89512D" />,
];

interface BigBoardTabOptions {
    name: string;
    key: number | string;
}

interface BigBoardProps {
    tabItems: BigBoardTabOptions[];
    tabKey: string;
    title: string;
    onChange: Function;
    children: React.ReactNode;
}

export default (props: BigBoardProps) => {
    const { tabItems, tabKey, onChange, title, children } = props;

    return (
        <div className="big-board">
            <ul className="big-board-tab-group">
                {tabItems.map((tab, index) => {
                    return (
                        <li
                            key={tab.key}
                            className={classNames({
                                'big-board-tab-wrapper': true,
                                active: tabKey === tab.key,
                            })}
                            onClick={() => onChange(tab.key)}
                        >
                            {svgs[index]}
                            <div className="big-board-tab">
                                <span>{tab.name}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className="big-board-container">
                <h3 className="common-title silver big-board-title">
                    <span>{title}</span>
                </h3>
                {children}
            </div>
        </div>
    );
};
