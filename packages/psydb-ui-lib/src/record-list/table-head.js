import React from 'react';
import { TableHead } from '@mpieva/psydb-ui-layout';
import FieldDataHeadCols from './field-data-head-cols';

const RLTableHead = (ps) => {
    var {
        displayFieldData,
        sorter,
        showActionColumn = true,
        showSelectionIndicator = false,
        canSort = false,
    } = ps;

    var headBag = {
        showActionColumn,
        showSelectionIndicator,
    }
    var columnBag = {
        displayFieldData,
        sorter,
        canSort
    }

    return (
        <TableHead { ...headBag }>
            <FieldDataHeadCols { ...columnBag } />
        </TableHead>
    )
}

export default RLTableHead;
