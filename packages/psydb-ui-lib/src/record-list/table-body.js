import React from 'react';
import TableRow from './table-row';

const TableBody = (ps) => {
    var { records, ...pass } = ps;

    return (
        <tbody>{ records.map(it => (
                <TableRow key={ it._id } record={ it } { ...pass } />
        )) }</tbody>
    )
}

export default TableBody;
