import React, { useState, useEffect } from 'react';

import {
    Table
} from 'react-bootstrap';

import TableHead from './table-head';
import TableBody from './table-body';

var RecordListTable = ({
    className,

    records,
    displayFieldData,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    
    enableView,
    enableEdit_old,
    
    enableSelectRecords,
    showSelectionIndicator,
    wholeRowIsClickable,
    selectedRecordIds,
    onSelectRecord,
    
    linkBaseUrl,
    CustomActionListComponent,
    bsTableProps,
}) => {
    if (!records.length) {
        return (
            <div>Empty</div> 
        );
    }

    var wrappedOnSelectRecord = (
        onSelectRecord
        ? (record) => {
            if (!onSelectRecord) {
                return
            }

            if (selectedRecordIds) {
                var action = (
                    selectedRecordIds.includes(record._id)
                    ? ({ type: 'remove', payload: { id: record._id, record } })
                    : ({ type: 'add', payload: { id: record._id, record } })
                );
                return onSelectRecord(action);
            }
            else {
                return onSelectRecord(record);
            }
        }
        : undefined
    );

    return (
        <Table className={ className } { ...bsTableProps }>
            <TableHead
                displayFieldData={ displayFieldData }
                showSelectionIndicator={ showSelectionIndicator }
            />
            <TableBody { ...({
                records,
                displayFieldData,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,

                enableView,
                enableEdit_old,

                enableSelectRecords,
                showSelectionIndicator,
                wholeRowIsClickable,
                onSelectRecord: wrappedOnSelectRecord,
                selectedRecordIds,

                linkBaseUrl,
                CustomActionListComponent,
            })} />
        </Table>
    );
}

export default RecordListTable;
