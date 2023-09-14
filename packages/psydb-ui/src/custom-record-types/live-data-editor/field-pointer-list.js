import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Table, Button, Icons } from '@mpieva/psydb-ui-layout';

const FieldPointerList = (ps) => {
    var {
        onMoveItem,
        onRemoveItem,
        dataPointers = [],
        availableFieldDataByPointer,
    } = ps;

    var translate = useUITranslation();

    if (dataPointers.length < 1) {
        return (
            <p><i className='text-muted'>
                { translate('No display fields set.') }
            </i></p>
        )
    }

    return (
        <Table size='sm' className='bg-white border'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>{ translate('Field') }</th>
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
