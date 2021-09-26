import './pc.less';
import './mobile.less';

import 'react';
import Overlay from '@/components/Overlay';

interface RecordBoardProps {
    children: Object;
    visible: Boolean;
    title: String;
    close(): void;
}

export default (props: RecordBoardProps) => {
    const { children, visible, title, close } = props;

    return (
        <Overlay visable={visible}>
            <div className="record-board">
                <div className="title-wrapper">
                    <h1 className="common-title silver title">
                        <span>{title}</span>
                    </h1>
                </div>
                <button className="icon-close" onClick={close} />
                {children}
            </div>
        </Overlay>
    );
};
