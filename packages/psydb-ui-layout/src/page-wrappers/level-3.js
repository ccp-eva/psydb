import React from 'react';
import classnames from 'classnames';

export const Level3 = (ps) => {
    var {
        title,
        titleClassName,
        titleLinkUrl,
        className,
        children
    } = ps;
    
    titleClassName = classnames([
        'border-bottom',
        titleClassName,
    ]);

    return (
        <>
            <h4 className={ titleClassName }>
                { title }
            </h4>
            { children }
        </>
    )
}
