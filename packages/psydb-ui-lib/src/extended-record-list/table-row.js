import React from 'react';
import { TableBodyCustomCols } from '@mpieva/psydb-custom-fields-ui';

import {
    StudyIconButton,
    SubjectIconButton,
    LocationIconButton,
    ExperimentIconButton,
} from '@mpieva/psydb-ui-layout';

// XXX
const buttonMap = {
    'study': StudyIconButton,
    'subject': SubjectIconButton,
    'location': LocationIconButton,
    'experiment': ExperimentIconButton,
}

// XXX
const linkMap = {
    'study': 'studies',
    'subject': 'subjects',
    'location': 'locations',
    'experiment': 'experiments',
}

const TableRow = (ps) => {
    var { record, related, definitions, collection, rowClassName } = ps;
    var { _id, _isHidden = false, type = undefined } = record;

    var LinkButton = buttonMap[collection];

    return (
        <tr
            className={
                _isHidden
                ? 'bg-light text-grey'
                : (rowClassName ? rowClassName(record) : '')
            }
            role='button'
        >
            <TableBodyCustomCols
                record={ record }
                related={ related }
                definitions={ definitions }
            />
            <td>
                <div className='d-flex justify-content-end pb-0 pt-0'>
                    <LinkButton
                        to={`/${linkMap[collection]}/${type}/${_id}`}
                    />
                </div>
            </td>
        </tr>
    )
}

export default TableRow;
