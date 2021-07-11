import React from 'react';

import {
    CheckSquareFill,
    Square
} from 'react-bootstrap-icons';

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
                ? <CheckSquareFill />
                : <Square />
            }
        </td>
    );
}

export default CheckColumn;
