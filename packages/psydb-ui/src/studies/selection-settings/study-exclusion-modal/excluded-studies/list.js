import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { OptionDeselectIndicator } from '@mpieva/psydb-ui-layout';

export const List = (ps) => {
    var {
        records,
        onSelect
    } = ps;
    
    var translate = useUITranslation();

    if (records.length < 1) {
        return (
            <div className='px-3 py-2 text-muted'>
                <i>{ translate('No other studies excluded.') }</i>
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
