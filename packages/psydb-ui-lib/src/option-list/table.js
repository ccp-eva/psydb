import React from 'react';

import {
    Table as BSTable,
    TableHead,
    TableEmptyFallback,
} from '@mpieva/psydb-ui-layout';

import {
    TableHeadCustomCols,
    TableBodyCustomCols,
} from '@mpieva/psydb-custom-fields-ui';

import TableRow from './table-row';

const Table = (ps) => {
    var {
        tableClassName,
        bsTableProps,

        records,
        related,
        definitions,

        timezone = 'Europe/Berlin', // XXX

        onSelectRecord,
        sorter,
    } = ps;

    if (records.length < 1) {
        return (
            <TableEmptyFallback
                tableExtraClassName={ tableClassName }
                { ...bsTableProps }
            >
                <TableHeadCustomCols definitions={ definitions } />
            </TableEmptyFallback>
        )
    }

    return (
        <BSTable
            style={{
                borderCollapse: 'separate', borderSpacing: 0,
                //border: '1px solid red'
            }}
            className={ tableClassName } { ...bsTableProps }
        >
            <TableHead showActionColumn={ true }>
                <TableHeadCustomCols
                    definitions={ definitions }
                    sorter={ sorter }
                    canSort={ true }
                />
            </TableHead>
            <tbody>{ records.map(it => (
                <TableRow
                    key={ it._id }
                    record={ it }
                    related={ related }
                    definitions={ definitions }
                    onSelectRecord={ onSelectRecord }
                />
            ))}</tbody>
        </BSTable>
    )
}


export default Table;
