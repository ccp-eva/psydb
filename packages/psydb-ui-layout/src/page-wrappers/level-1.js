import React from 'react';
import classnames from 'classnames';

export const Level1 = (ps) => {
    var {
        title,
        titleClassName,
        titleLinkUrl,
        className,
        children
    } = ps;
    
    titleClassName = classnames([
        'mb-0 border-bottom',
        titleClassName,
    ]);

    return (
        <div>
            <h1 className={ titleClassName }>
                { title }
            </h1>
            { children }
        </div>
    )
}
