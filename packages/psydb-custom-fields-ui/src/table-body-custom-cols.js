import React from 'react';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { LinkTD } from '@mpieva/psydb-ui-layout';

const TableBodyCustomCols = (ps) => {
    var { record, related, definitions, wrapAsLinkTo = false } = ps;
    var [ i18n ] = useI18N();

    var out = [];
    for (var it of definitions) {
        var { systemType, pointer } = it;

        var stringify = Fields[systemType]?.stringifyValue;
        var str = stringify ? (
            stringify({ definition: it, record, related, i18n })
        ) : '[!!MISSING_STRINGIFER!!]';

        out.push(wrapAsLinkTo ? (
            <LinkTD key={ pointer } href={ wrapAsLinkTo }>{ str }</LinkTD>
        ) : (
            <td key={ pointer }>{ str }</td>
        ));
    }
    return out;
}

export default TableBodyCustomCols;
