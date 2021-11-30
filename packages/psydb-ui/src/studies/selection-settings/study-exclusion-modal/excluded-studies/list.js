import React from 'react';
import { OptionDeselectIndicator } from '@mpieva/psydb-ui-layout';

export const List = (ps) => {
    var {
        records,
        onSelect
    } = ps;

    if (records.length < 1) {
        return (
            <div className='px-3 py-2 text-muted'>
                <i>Keine anderen ausgeschlossenen Studien</i>
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
                        <td className='table-selection-indicator'>
                            <OptionDeselectIndicator />
                        </td>
                        <td className='px-3'>
                            { it.state.name } ({ it.state.shorthand })
                        </td>
                    </tr>
                )) }
            </tbody>
        </table>
    );
}
