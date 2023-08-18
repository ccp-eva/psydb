import React from 'react';

export const CalItemPair = (ps) => {
    var { label, extraClassName, children } = ps;
    return (
        <div className={ `d-flex text-small ${extraClassName}` }>
            <b className='flex-shrink-0' style={{ width: '70px' }}>
                { label }
            </b>
            <div>
                { children }
            </div>
        </div>
    )
}
