import React, { useState, useEffect } from 'react';

import {
    Table,
    Alert,
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
    enableRecordRowLink,
    
    enableSelectRecords,
    showSelectionIndicator,
    wholeRowIsClickable,
    selectedRecordIds,
    onSelectRecord,
    
    linkBaseUrl,
    CustomActionListComponent,
    bsTableProps,
    emptyInfoText,

    pagination,
    sorter,
    canSort,
}) => {
    if (!records.length) {
        return (
            <>
                <Table className={ 'mb-1 ' + className } { ...bsTableProps }>
                    <TableHead
                        displayFieldData={ displayFieldData }
                        showSelectionIndicator={ showSelectionIndicator }
                    />
                </Table>
                <Alert variant='info'>
                    <i>{ emptyInfoText || 'Keine Datensätze gefunden'}</i>
                </Alert>
            </>
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

    if (enableRecordRowLink) {
        bsTableProps = { ...bsTableProps, hover: true };
    }
    return (
        <Table
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
            className={ className } { ...bsTableProps }
        >
            <TableHead
                displayFieldData={ displayFieldData }
                showSelectionIndicator={ showSelectionIndicator }
                pagination={ pagination }
                sorter={ sorter }
                canSort={ canSort }
            />
            <TableBody { ...({
                records,
                displayFieldData,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,

                enableView,
                enableEdit_old,
                enableRecordRowLink,

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
