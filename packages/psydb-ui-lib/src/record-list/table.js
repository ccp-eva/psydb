import React, { useState, useEffect } from 'react';

import {
    Table
} from 'react-bootstrap';

import TableHead from './table-head';
import TableBody from './table-body';

var RecordListTable = ({
    records,
    displayFieldData,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    
    enableView,
    enableEdit,
    
    enableSelectRecords,
    showSelectionIndicator,
    selectedRecordIds,
    onSelectRecord,
    
    enableFilters,
    onFilterSubmit,

    linkBaseUrl
}) => {
    if (!records.length) {
        return (
            <div>Empty</div> 
        );
    }

    var wrappedOnSelectRecord = (record) => {
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

    return (
        <Table hover={ onSelectRecord ? true : false }>
            { enableFilters && (
                <TableFilters
                    displayFieldData={ displayFieldData }
                    onSubmit={ onFilterSubmit }
                />
            )}
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
                enableEdit,

                enableSelectRecords,
                showSelectionIndicator,
                onSelectRecord: wrappedOnSelectRecord,
                selectedRecordIds,

                linkBaseUrl
            })} />
        </Table>
    );
}

export default RecordListTable;
