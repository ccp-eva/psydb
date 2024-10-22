import React from 'react';
import { TableBodyCustomCols } from '@mpieva/psydb-custom-fields-ui';

const TableRow = (ps) => {
    var { record, related, definitions, collection } = ps;
    var { _isHidden = false, type = undefined } = record;

    return (
        <tr
            className={ _hidden && 'bg-light text-grey' }
            role='button'
        >
            <TableBodyCustomCols
                record={ record }
                related={ related }
                definitions={ definitions }
            />
            <td>
                <div className='d-flex justify-content-end pb-0 pt-0'>
                    AAAAAAAAAAAAa
                </div>
            </td>
        </tr>
    )
}

export default TableRow;
