import React from 'react';

import {
    PageWrappers,
    OptionSelectIndicator,
    Icons
} from '@mpieva/psydb-ui-layout';

export const List = (ps) => {
    var {
        records,
        onSelect
    } = ps;

    if (records.length < 1) {
        return (
            <div className='px-3 py-2 text-muted'>
                <i>Keine Studien für diese Kriterien</i>
            </div>
        )
    }

    return(
        <table className='table table-hover table-borderless table-sm table-selectable'>
            <tbody>
                { records.map((it, index) => (
                    <tr
                        key={ index }
                        role='button'
                        onClick={ () => onSelect(it) }
                    >
                        <td className='px-3'>
                            { it.state.name } ({ it.state.shorthand })
                        </td>
                        <td className='table-selection-indicator'>
                            <OptionSelectIndicator />
                        </td>
                    </tr>
                )) }
            </tbody>
        </table>
    );
}
