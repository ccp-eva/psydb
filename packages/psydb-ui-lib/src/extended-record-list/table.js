import React from 'react';
import {
    Table as BSTable,
    TableHead,
} from '@mpieva/psydb-ui-layout';

import { TableHeadCustomCols } from '@mpieva/psydb-custom-fields-ui';
import TableRow from './table-row';

const Table = (ps) => {
    var { collection, definitions, records, related } = ps;

    return (
        <BSTable>
            <TableHead showActionColumn={ true }>
                <TableHeadCustomCols definitions={ definitions } />
            </TableHead>
            <tbody>{ records.map(it => (
                <TableRow
                    key={ it._id }
                    collection={ collection }
                    record={ it }
                    related={ related }
                    definitions={ definitions }
                />
            )) }</tbody>
        </BSTable>
    )
}

export default Table;
