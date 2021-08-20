import React from 'react';
import './index.less';
import classNames from 'classnames';

type PlacementType = 'right' | 'left';

interface FolderProps {
    children: React.ReactNode;
    placement?: PlacementType;
}

const Folder = (props: FolderProps) => {
    const { children, placement } = props;
    const [toggle, setToggle] = React.useState(false);

    const boxStyle = React.useMemo(() => {
        return toggle
            ? {
                  transform: `translateX(90%)`,
              }
            : {
                  transform: `translateX(0)`,
              };
    }, [toggle]);

    const btnStyle = React.useMemo(() => {
        return toggle
            ? {
                  transform: `translate(-50%, -30%) rotate(0)`,
              }
            : {
                  transform: `translate(-50%, -30%) rotate(540deg)`,
              };
    }, [toggle]);

    return (
        <div className="iron-folder" style={{ ...boxStyle, [placement]: 0 }}>
            <div className="iron-folder-wrapper">
                <button
                    style={btnStyle}
                    className="btn-toggle"
                    onClick={() => setToggle(!toggle)}
                />
                {children}
            </div>
        </div>
    );
};

Folder.defaultProps = {
    placement: 'right',
};

export default Folder;
