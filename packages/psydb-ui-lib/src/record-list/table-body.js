import React, { useState, useEffect } from 'react';

import TableRow from './table-row';

const TableBody = ({
    displayFieldData,
    records,

    enableView,
    enableEdit,
    
    enableSelectRecord,
    showSelectionIndicator,
    onSelectRecord,
    selectedRecordIds,
    
    linkBaseUrl,
}) => {
    return (
        <tbody>
            { records.map(it => (
                <TableRow { ...({
                    key: it._id,
                    record: it,

                    displayFieldData,
                    enableView,
                    enableEdit,
                    linkBaseUrl,
                
                    enableSelectRecord,
                    showSelectionIndicator,
                    onSelectRecord,
                    selectedRecordIds,
                })} />
            )) }
        </tbody>
    )
}

export default TableBody;
