import React from 'react';
import classnames from 'classnames';
import { Table, Alert } from 'react-bootstrap';

import { TableHead } from './table-head';
import { TableHeadCustomCols } from './table-head-custom-cols';

export const TableEmptyFallback = (ps) => {
    var {
        showActionColumn,
        showSelectionIndicator,

        emptyInfoText = 'Keine Datensätze gefunden',
        tableClassName,
        tableExtraClassName,
        children,
        ...passToTable
    } = ps;

    tableClassName = tableClassName || classnames([
        'mb-1', tableExtraClassName
    ]);

    var tableBag = { className: tableClassName, ...passToTable };
    var headBag = { showActionColumn, showSelectionIndicator };

    return (
        <>
            <Table { ...tableBag }>
                <TableHead { ...headBag }>
                    { children }
                </TableHead>
            </Table>
            <Alert variant='info'>
                <i>{ emptyInfoText }</i>
            </Alert>
        </>
    );
}
