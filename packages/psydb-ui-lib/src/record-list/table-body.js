import React from 'react';
import TableRow from './table-row';

const TableBody = (ps) => {
    var {
        displayFieldData,
        records,
        definitions,
        transformer,

        enableView,
        enableEdit_old,
        enableRecordRowLink,
        
        enableSelectRecord,
        showSelectionIndicator,
        wholeRowIsClickable,
        onSelectRecord,
        selectedRecordIds,
        
        linkBaseUrl,
        CustomActionListComponent,
    } = ps;

    return (
        <tbody>
            { records.map(it => (
                <TableRow { ...({
                    key: it._id,
                    record: it,
                    definitions,
                    transformer,
                    
                    enableView,
                    enableEdit_old,
                    enableRecordRowLink,
                    linkBaseUrl,
                
                    enableSelectRecord,
                    showSelectionIndicator,
                    wholeRowIsClickable,
                    onSelectRecord,
                    selectedRecordIds,
                    
                    CustomActionListComponent,
                })} />
            )) }
        </tbody>
    )
}

export default TableBody;
