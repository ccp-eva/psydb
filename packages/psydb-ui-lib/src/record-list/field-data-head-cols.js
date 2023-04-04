import React from 'react';
import { convertPointerToPath } from '@mpieva/psydb-core-utils';
import { SortableTH } from '@mpieva/psydb-ui-layout';

const FieldDataHeadCols = (ps) => {
    var {
        displayFieldData,
        sorter,
        canSort = false,
    } = ps;

    return displayFieldData.map((it, ix) => {
        var { type, systemType, displayName, pointer, dataPointer } = it; 
        // FIXME
        pointer = pointer || dataPointer;
        type = type || systemType;

        var canSortColumn = canSort && [
            'SaneString',
            'Address',
            'DateOnlyServerSide',
            'BiologicalGender',
            'Integer',
            'DateTime',
            'ExtBool'
        ].includes(type);

        return (
            canSortColumn
            ? (
                <SortableTH
                    key={ ix }
                    sorter={ sorter }
                    label={ displayName }
                    path={ convertPointerToPath(pointer) }
                    isFirstColumn={ ix === 0 }
                />
            )
            : (
                <th>{ displayName }</th>
            )
        );
    })

}

export default FieldDataHeadCols;
