import './pc.less';
import './mobile.less';

import 'react';

interface ICommentaryCardProps {
    title: String;
    description: String;
}

export default (props: ICommentaryCardProps) => {
    const { title, description } = props;

    return (
        <div className="commentary-card">
            <h3 className="common-title gold title">
                <span>{title}</span>
            </h3>
            <p className="description">{description}</p>
        </div>
    );
};
