import React from 'react';
import { Icons } from '@mpieva/psydb-ui-layout';

const CheckColumn = ({
    record,
    onSelectRecord,
    selectedRecordIds
}) => {

    return (
        <td
            role={ onSelectRecord ? 'button' : undefined }
            onClick={(
                onSelectRecord
                ? () => onSelectRecord(record)
                : undefined
            )}
        >
            {
                selectedRecordIds.includes(record._id)
                ? <Icons.CheckSquareFill />
                : <Icons.Square />
            }
        </td>
    );
}

export default CheckColumn;
