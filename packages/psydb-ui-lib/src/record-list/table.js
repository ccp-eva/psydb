import React from 'react';
import { __fixRelated, __fixDefinitions } from '@mpieva/psydb-common-compat';
import { TableHeadCustomCols } from '@mpieva/psydb-custom-fields-ui';

import {
    Table,
    TableHead,
    TableEmptyFallback
} from '@mpieva/psydb-ui-layout';

import TableBody from './table-body';

var RecordListTable = (ps) => {
    var {
        className,

        records,
        displayFieldData,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypes,
        
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
    } = ps;

    var definitions = __fixDefinitions(displayFieldData);
    var related = __fixRelated({
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypes,
    }, { isResponse: false });

    if (!records.length) {
        return (
            <TableEmptyFallback
                tableExtraClassName={ className }
                { ...bsTableProps }
            >
                <TableHeadCustomCols definitions={ definitions } />
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
                    definitions={ definitions }
                    sorter={ sorter }
                    canSort={ canSort }
                />
            </TableHead>

            <TableBody { ...({
                records,
                definitions,
                related,

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
