import React from 'react';
import {
    Table as BSTable,
    TableHead,
} from '@mpieva/psydb-ui-layout';

import { TableHeadCustomCols } from '@mpieva/psydb-custom-fields-ui';
import TableRow from './table-row';

const Table = (ps) => {
    var { collection, definitions, records, related, rowClassName } = ps;

    return (
        <BSTable>
            <TableHead showActionColumn={ true }>
                <TableHeadCustomCols definitions={ definitions } />
            </TableHead>
            <tbody>{ records.map((it, ix) => (
                <TableRow
                    // NOTE: records can be unwound i.e. _id is not unique
                    key={ `${it._id}_${ix}` }
                    collection={ collection }
                    record={ it }
                    related={ related }
                    definitions={ definitions }
                    rowClassName={ rowClassName }
                />
            )) }</tbody>
        </BSTable>
    )
}

export default Table;
