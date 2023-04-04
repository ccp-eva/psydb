import React from 'react';
import { TableHeadCustomCols } from '@mpieva/psydb-ui-layout';

// FIXME: for compatibiliuty
// TODO: make obsolete
const FieldDataHeadCols = (ps) => {
    var { displayFieldData, ...pass } = ps;
    return (
        <TableHeadCustomCols
            definitions={ displayFieldData }
            { ...pass }
        />
    )
}

export default FieldDataHeadCols;
