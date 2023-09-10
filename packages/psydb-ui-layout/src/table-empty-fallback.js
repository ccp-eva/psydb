import React from 'react';
import classnames from 'classnames';
import { Table, Alert } from 'react-bootstrap';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import { TableHead } from './table-head';
import { TableHeadCustomCols } from './table-head-custom-cols';

export const TableEmptyFallback = (ps) => {
    var {
        showActionColumn,
        showSelectionIndicator,

        emptyInfoText = 'No Records found.',
        tableClassName,
        tableExtraClassName,
        children,
        ...passToTable
    } = ps;

    var translate = useUITranslation();

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
                <i>{ translate(emptyInfoText) }</i>
            </Alert>
        </>
    );
}
