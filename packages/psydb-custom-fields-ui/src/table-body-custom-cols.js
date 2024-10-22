import React from 'react';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';

const TableBodyCustomCols = (ps) => {
    var { record, related, definitions } = ps;
    var [ i18n ] = useI18N();

    var out = [];
    for (var it of definitions) {
        var { systemType, pointer } = it;

        var field = Fields[systemType];
        var str = field.stringifyValue({
            definition: it, record, related, i18n
        });

        out.push(
            <td key={ pointer }>{ str }</td>
        );
    }
    return out;
}

export default TableBodyCustomCols;
