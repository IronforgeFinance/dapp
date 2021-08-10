import React from 'react';
import './index.less';

interface ICommentaryCardProps {
    title: String;
    description: String;
}

export default (props: ICommentaryCardProps) => {
    const { title, description } = props;

    return (
        <div className="commentary-card">
            <h3 className="title">
                <span>{title}</span>
            </h3>
            <p className="description">{description}</p>
        </div>
    );
};
