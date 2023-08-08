import React from 'react';
import { jsonpointer } from '@mpieva/psydb-core-utils';

export const TableBodyCustomCols = (ps) => {
    var {
        definitions,
        record,
        transformer,
        
        wrapAsLinkTo,
    } = ps;

    return definitions.map((definition, ix) => {
        var { systemType, displayName, pointer } = definition;
        var value = jsonpointer.get(record, pointer);

        if (transformer) {
            value = transformer({ value, definition, record });
        }

        return (
            wrapAsLinkTo 
            ? (
                <LinkTD key={ pointer } href={ wrapAsLinkTo }>
                    { value }
                </LinkTD>
            )
            : <td key={ pointer }>{ value }</td>
        )
    })

}

const LinkTD = (ps) => {
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
