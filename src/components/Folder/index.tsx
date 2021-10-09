import './pc.less';
import './mobile.less';

import classNames from 'classnames';
import React from 'react';
import { keyframes } from 'styled-components';

type PlacementType = 'right' | 'left';

interface FolderProps {
    children: React.ReactNode;
    placement?: PlacementType;
    foldingOffest?: number;
    value?: boolean;
}

export interface FolderContextProps {
    changeToggle: (toggle: boolean) => void;
    toggle: boolean;
}

export const FolderContext = React.createContext<FolderContextProps | null>(
    null,
);

const Folder = (props: FolderProps) => {
    const { children, placement, foldingOffest, value } = props;
    const [toggle, setToggle] = React.useState(true);

    // * layoutEffect插在RAF里面执行，所以是插入帧之前完成
    // * 如果使用effect，就是下一帧完成，开始的时候会看到一个动画
    // React.useLayoutEffect(() => setToggle(value), [value]);
    React.useEffect(() => setToggle(value), [value]);

    const boxStyle = React.useMemo(() => {
        return toggle
            ? { transform: `translateX(${foldingOffest}%)` }
            : { transform: `translateX(0)` };
    }, [toggle]);

    const btnStyle = React.useMemo(() => {
        return toggle
            ? { transform: `translate(-50%, -30%) rotate(540deg)` }
            : { transform: `translate(-50%, -30%) rotate(0)` };
    }, [toggle]);

    React.useEffect(() => {
        const folderDom = document.querySelector('.iron-folder');
        if (folderDom) {
            !toggle
                ? folderDom.classList.add('shake-effect')
                : folderDom.classList.remove('shake-effect');
        }
    }, [toggle]);

    return (
        <div className="iron-folder" style={{ ...boxStyle, [placement]: 0 }}>
            <div className="iron-folder-wrapper">
                <button
                    style={btnStyle}
                    className="btn-toggle"
                    onClick={() => setToggle(!toggle)}
                />
                <FolderContext.Provider
                    value={{
                        changeToggle: (toggle) => setToggle(toggle),
                        toggle,
                    }}
                >
                    {children}
                </FolderContext.Provider>
            </div>
        </div>
    );
};

Folder.defaultProps = {
    placement: 'right',
    foldingOffest: 90,
    value: false,
};

export default Folder;
