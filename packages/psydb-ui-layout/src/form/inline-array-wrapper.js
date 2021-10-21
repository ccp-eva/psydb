import React from 'react';

export const InlineArrayWrapper = (ps) => {
    var {
        label,
        labelClassName,
        children,
    } = ps;

    return (
        <div className='row mr-0 ml-0'>
            <header className={ `col-sm-3 ${labelClassName}` }>
                { label }
            </header>
            <div className='col-sm-9 p-0'>
                { children }
            </div>
        </div>
    );
}
