import React from 'react';
import classnames from 'classnames';

export const Level2 = (ps) => {
    var {
        title,
        titleClassName,
        titleLinkUrl,
        className,
        children
    } = ps;
    
    titleClassName = classnames([
        'mt-0 mb-3 text-muted',
        titleClassName,
    ]);

    return (
        <>
            <h5 className={ titleClassName }>
                { title }
            </h5>
            { children }
        </>
    )
}
