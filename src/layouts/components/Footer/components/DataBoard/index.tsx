import './less/index.less';

import React from 'react';
import { ReactComponent as TabBackIcon01 } from '@/assets/images/big-board-svg-01.svg';
import { ReactComponent as TabBackIcon02 } from '@/assets/images/big-board-svg-02.svg';
import { ReactComponent as TabBackIcon03 } from '@/assets/images/big-board-svg-03.svg';
import { ReactComponent as TabBackIcon04 } from '@/assets/images/big-board-svg-04.svg';
import classNames from 'classnames';
import Overlay from '@/components/Overlay';

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
    tabItems?: BigBoardTabOptions[];
    tabKey?: string;
    visable?: boolean;
    title?: string;
    onChange?: Function;
    onClose?: Function;
    children?: React.ReactNode;
}

const DataBoard = (props: BigBoardProps) => {
    const { visable, onClose, tabItems, tabKey, onChange, title, children } =
        props;

    return (
        <Overlay visable={visable}>
            <div className="data-board big-board">
                <ul className="big-board-tab-group">
                    {tabItems &&
                        tabItems.map((tab, index) => {
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
                    <button className="btn-close" onClick={() => onClose()} />
                    {children}
                </div>
            </div>
        </Overlay>
    );
};

DataBoard.defaultProps = {
    visable: false,
};

export default DataBoard;
