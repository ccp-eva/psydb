import React from 'react';

export const LinkTD = (ps) => {
    var { href, children } = ps;
    return (
        <td className='p-0'>
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
