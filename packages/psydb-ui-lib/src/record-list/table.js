import React, { useState, useEffect } from 'react';

import {
    Table,
    Alert,
} from 'react-bootstrap';

import {
    TableHead,
    TableHeadCustomCols,
    TableEmptyFallback
} from '@mpieva/psydb-ui-layout';

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
            <TableEmptyFallback
                tableExtraClassName={ className }
                { ...bsTableProps }
            >
                <TableHeadCustomCols definitions={ displayFieldData } />
            </TableEmptyFallback>
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
                showActionColumn={ true }
                showSelectionIndicator={ showSelectionIndicator }
            >
                <TableHeadCustomCols
                    definitions={ displayFieldData }
                    sorter={ sorter }
                    canSort={ canSort }
                />
            </TableHead>

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
