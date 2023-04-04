import React from 'react';
import { convertPointerToPath } from '@mpieva/psydb-core-utils';
import { SortableTH } from './sortable-th';

export const TableHeadCustomCols = (ps) => {
    var {
        definitions,
        sorter,
        canSort = false,
    } = ps;

    return definitions.map((it, ix) => {
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
                <th key={ ix }>{ displayName }</th>
            )
        );
    })

}


