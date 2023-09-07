import React from 'react';

export const TeamLabel = (ps) => {
    var { color, name, className, style } = ps;
    var pass = { className, style };

    return (
        <span { ...pass }>
            <span className='d-inline-block mr-2' style={{
                backgroundColor: color,
                height: '24px',
                width: '24px',
                verticalAlign: 'bottom',
            }} />
            { name }
        </span>
    )
}
