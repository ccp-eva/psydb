import React, { useState, useEffect } from 'react';

import TableRow from './table-row';

const TableBody = ({
    displayFieldData,
    records,
    relatedRecordLabels,
    relatedHelperSetItems,

    enableView,
    enableEdit_old,
    
    enableSelectRecord,
    showSelectionIndicator,
    onSelectRecord,
    selectedRecordIds,
    
    linkBaseUrl,
    CustomActionListComponent,
}) => {
    return (
        <tbody>
            { records.map(it => (
                <TableRow { ...({
                    key: it._id,
                    record: it,
                    relatedRecordLabels,
                    relatedHelperSetItems,

                    displayFieldData,
                    enableView,
                    enableEdit_old,
                    linkBaseUrl,
                
                    enableSelectRecord,
                    showSelectionIndicator,
                    onSelectRecord,
                    selectedRecordIds,
                    
                    CustomActionListComponent,
                })} />
            )) }
        </tbody>
    )
}

export default TableBody;
