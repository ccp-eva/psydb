import React from 'react';

import {
    TableEmptyFallback,
    TableHeadCustomCols,
} from '@mpieva/psydb-ui-layout';

const TableFallback = (ps) => {
    var { definitions } = ps;
    return (
        <TableEmptyFallback>
            <TableHeadCustomCols definitions={ definitions } />
        </TableEmptyFallback>
    )
}

export default TableFallback;
