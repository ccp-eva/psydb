import React from 'react';

export const NarrowHR = (ps) => {
    var { extraStyle, ...pass } = ps;

    return (
        <hr className='mt-1 mb-1' style={{
            marginLeft: '15em',
            marginRight: '15em',
            ...extraStyle
        }} { ...pass } />
    )
}
