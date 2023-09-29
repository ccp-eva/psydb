import React from 'react';
import { useUILanguage } from '@mpieva/psydb-ui-contexts';
import { convertPointerToPath } from '@mpieva/psydb-core-utils';
import { SortableTH } from './sortable-th';

export const TableHeadCustomCols = (ps) => {
    var {
        definitions,
        sorter,
        canSort = false,
    } = ps;

    var [ language ] = useUILanguage();

    return definitions.map((it, ix) => {
        var {
            type,
            systemType,
            displayName,
            displayNameI18N = {},
            pointer,
            dataPointer
        } = it; 

        // FIXME
        // FIXME use fixDefinitions()
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
                    label={ displayNameI18N[language] || displayName }
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


