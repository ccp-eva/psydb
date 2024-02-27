import React from 'react';

export const SmallFormFooter = (ps) => {
    var { children, extraClassName } = ps;
    var className = `d-flex justify-content-between align-items-center flex-row-reverse ${extraClassName}`;

    return (
        <div className={ className }>
            { children }
        </div>
    )
}
