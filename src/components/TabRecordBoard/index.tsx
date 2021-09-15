import './less/index.less';

import { ReactComponent as TabBackIcon01 } from '@/assets/images/big-board-svg-01.svg';
import classNames from 'classnames';
import Overlay from '../Overlay';
import { Fragment } from 'react';

interface TabOptions {
    name: string;
    key: number | string;
    icon: React.SVGProps<SVGSVGElement>;
}

interface ModalOption {
    visible?: boolean;
    close?(): void;
}

interface TabRecordBoardProps extends ModalOption {
    tabItems: TabOptions[];
    tabKey: string;
    title: string;
    onChange: Function;
    children: React.ReactNode;
    mode?: 'modal' | 'normal';
}

const TabRecordBoard = (props: TabRecordBoardProps) => {
    const {
        tabItems,
        tabKey,
        onChange,
        title,
        children,
        mode,
        visible,
        close,
    } = props;

    const Content = () => (
        <section className="tab-record-board">
            <ul className="tab-record-board-tab-group">
                {tabItems.map((tab) => {
                    return (
                        <li
                            key={tab.key}
                            className={classNames({
                                'tab-record-board-tab-wrapper': true,
                                active: tabKey === tab.key,
                            })}
                            onClick={() => onChange(tab.key)}
                        >
                            {tab.icon}
                            <button className="tab-record-board-tab">
                                <span>{tab.name}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
            <div className="tab-record-board-container">
                <h3 className="common-title silver tab-record-board-title">
                    <span>{title}</span>
                </h3>
                <main>{children}</main>
            </div>
            {mode === 'modal' && (
                <button className="icon-close" onClick={close} />
            )}
        </section>
    );

    return (
        <Fragment>
            {mode === 'modal' && (
                <Overlay visable={visible} onClose={close}>
                    <Content />
                </Overlay>
            )}
            {mode === 'normal' && <Content />}
        </Fragment>
    );
};

TabRecordBoard.defaultProps = {
    tabItems: [
        {
            key: 'demo',
            name: 'Demo',
            icon: <TabBackIcon01 fill="#89512D" />,
        },
    ],
    title: 'Your Title',
    mode: 'normal',
    visible: false,
};

export default TabRecordBoard;
