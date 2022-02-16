import React from 'react';

import {
    Table,
    Button,
    Icons
} from '@mpieva/psydb-ui-layout';

const FieldPointerList = ({
    onMoveItem,
    onRemoveItem,
    dataPointers,
    availableFieldDataByPointer,
}) => {
    // TODO: andle move/remove
    if (dataPointers.length < 1) {
        return (
            <p>
                Keine Anzeigefelder festgelegt
            </p>
        )
    }

    return (
        <Table size='sm' className='bg-white border'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Feld</th>
                </tr>
            </thead>
            <tbody>
                { dataPointers.map((dataPointer, index) => {
                    var {
                        displayName,
                    } = availableFieldDataByPointer[dataPointer];
                    return (
                        <tr key={ dataPointer }>
                            <td>{ index + 1 }</td>
                            <td>{ displayName }</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

export default FieldPointerList;
