import React from 'react';
import { OptionSelectIndicator } from '@mpieva/psydb-ui-layout';
import { TableBodyCustomCols } from '@mpieva/psydb-custom-fields-ui';

const TableRow = (ps) => {
    var { record, related, definitions, onSelectRecord } = ps;
    var { _isHidden } = record;

    return (
        <tr
            className={ _isHidden ? 'bg-light text-grey' : '' }
            role='button'
            onClick={ () => onSelectRecord(record) }
        >
            <TableBodyCustomCols
                record={ record }
                related={ related }
                definitions={ definitions }
            />
            <td>
                <div className='d-flex justify-content-end pb-0 pt-0'>
                    <OptionSelectIndicator record={ record } />
                </div>
            </td>
        </tr>
    )
}

export default TableRow;
