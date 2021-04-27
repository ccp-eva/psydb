import React, { useState, useEffect } from 'react';

import TableRow from './table-row';

const TableBody = ({
    displayFieldData,
    records,
    relatedRecords,
    relatedHelperSetItems,

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
                    relatedRecords,
                    relatedHelperSetItems,

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
