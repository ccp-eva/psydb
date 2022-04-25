import React from 'react';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import {
    Button,
    EditIconButtonInline
} from '@mpieva/psydb-ui-layout';

import { FieldDataBodyCols } from '@mpieva/psydb-ui-lib/src/record-list';
import UpcomingExperiments from '../upcoming-experiments';

const TableBody = ({
    records,
    related,
    onScheduleGroup,
}) => {
    var permissions = usePermissions();

    return (
        <tbody>
            { records.map((record, index) => {
                return (
                    <TableRow key={ index} { ...({
                        record,
                        related,
                        onScheduleGroup,
                    }) }/>
                )
            })}
        </tbody>

    );
}

const TableRow = ({
    record,
    related,
    
    onScheduleGroup,
}) => {
    return (
        <tr>
            {/*<td>{ record.sequenceNumber }</td>*/}
            <td>{ record.state.name }</td>
            <td>
                <div className='d-flex justify-content-end'>
                    <Button
                        size='sm'
                        onClick={ () => onScheduleGroup({ record }) }
                    >
                        Termin
                    </Button>
                </div>
            </td>
        </tr>
    )
}

export default TableBody
