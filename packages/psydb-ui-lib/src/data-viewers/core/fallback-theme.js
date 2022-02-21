import React from 'react';

export const Field = (ps) => {
    var { label, children } = ps;

    return (
        <div className='mb-3'>
            <header><b>{ label }</b></header>
            { children }
        </div>
    )
}
