import React from 'react';

export const LinkTD = (ps) => {
    var { href, className, children } = ps;
    return (
        <td className={ className ? `p-0 ${className}` : 'p-0' }>
            <a
                href={ href }
                className='d-block text-reset'
                style={{ textDecoration: 'none', padding: '0.75rem' }}
            >
                { children }
            </a>
        </td>
    )
}
