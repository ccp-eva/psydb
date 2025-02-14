import React from 'react';

import { TableEmptyFallback } from '@mpieva/psydb-ui-layout';
import { TableHeadCustomCols } from '@mpieva/psydb-custom-fields-ui';

const TableFallback = (ps) => {
    var { definitions } = ps;
    return (
        <TableEmptyFallback>
            <TableHeadCustomCols definitions={ definitions } />
        </TableEmptyFallback>
    )
}

export default TableFallback;
