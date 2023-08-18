import React from 'react';

export const SubjectListContainer = (ps) => {
    var { label, className, children } = ps;
    return (
        <div className={ className }>
            <b className='d-block text-small'>
                { label}
            </b>
            <ul
                className='m-0'
                style={{ paddingLeft: '20px', fontSize: '80%' }}
            >
                { children }
            </ul>
        </div>
    )
}
