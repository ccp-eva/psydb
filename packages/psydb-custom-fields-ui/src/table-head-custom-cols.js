import React from 'react';
import { convertPointerToPath } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { SortableTH } from '@mpieva/psydb-ui-layout';

const TableHeadCustomCols = (ps) => {
    var { definitions, sorter, canSort = false } = ps;
    var [{ language }] = useI18N();

    var out = [];
    for (var [ ix, it ] of definitions.entries()) {
        var { systemType, pointer, displayName, displayNameI18N = {}} = it;

        var label = displayNameI18N[language] || displayName;
        
        var canSortColumn = canSort && [
            'SaneString',
            'Address',
            'DateOnlyServerSide',
            'BiologicalGender',
            'Integer',
            'DateTime',
            'ExtBool',
            'Email',
            'DefaultBool',
        ].includes(systemType);
        
        out.push(canSortColumn ? (
            <SortableTH
                key={ pointer }
                sorter={ sorter }
                label={ label }
                path={ convertPointerToPath(pointer) }
                isFirstColumn={ ix === 0 }
            />
        ) : (
            <th key={ pointer }>{ label }</th>
        ));
    }

    return out;
}

export default TableHeadCustomCols;
