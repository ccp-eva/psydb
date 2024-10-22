import React from 'react';
import { TableBodyCustomCols } from '@mpieva/psydb-custom-fields-ui';

import {
    StudyIconButton,
} from '@mpieva/psydb-ui-layout';

const TableRow = (ps) => {
    var { record, related, definitions, collection } = ps;
    var { _id, _isHidden = false, type = undefined } = record;

    return (
        <tr
            className={ _isHidden && 'bg-light text-grey' }
            role='button'
        >
            <TableBodyCustomCols
                record={ record }
                related={ related }
                definitions={ definitions }
            />
            <td>
                <div className='d-flex justify-content-end pb-0 pt-0'>
                    <StudyIconButton
                        to={`/studies/${type}/${_id}`}
                    />
                </div>
            </td>
        </tr>
    )
}

export default TableRow;
