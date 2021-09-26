import './pc.less';
import './mobile.less';

import 'react';

const Loading = () => {
    return (
        <div className="iron-loading">
            <div className="animation">
                <i className="hammer" />
                <i className="stone" />
            </div>
            <span>Loading</span>
        </div>
    );
};

export default Loading;
