import React from 'react';

const Table = (ps) => {
    var { collection, definitions, records, related } = ps;

    return (
        <BSTable>
            <TableHead showActionColumn={ true }>
                <TableHeadCustomCols definitions={ definitions } />
                <tbody>{ records.map(it => (
                    <TableRow
                        key={ it._id }
                        collection={ collection }
                        record={ it }
                        related={ related }
                        definitions={ definitions }
                    />
                )) }</tbody>
            </TableHead>
        </BSTable>
    )
}

export default Table;
