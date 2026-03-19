import React from 'react';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { LinkTD } from '@mpieva/psydb-ui-layout';

const TableBodyCustomCols = (ps) => {
    var { record, related, definitions, wrapAsLinkTo = false } = ps;
    var [ i18n ] = useI18N();
    var { translate } = i18n;

    var isAnonymized = (
        record.gdpr?.state === '[[REDACTED]]'
        || record._isAnonymized
    );

    var out = [];
    for (var it of definitions) {
        var { systemType, pointer } = it;

        var stringify = Fields[systemType]?.stringifyValue;
        var str = stringify ? (
            isAnonymized && it.pointer.startsWith('/gdpr/state')
            ? <span className='text-danger'>{ translate('Anonymized') }</span>
            : stringify({ definition: it, record, related, i18n })
        ) : '[!!MISSING_STRINGIFIER!!]';

        if (str === '[!!MISSING_STRINGIFIER!!]') {
            console.log({ str, systemType });
        }

        out.push(wrapAsLinkTo ? (
            <LinkTD
                key={ pointer } href={ wrapAsLinkTo }
                className={ isAnonymized && 'text-danger' }
            >
                { str }
            </LinkTD>
        ) : (
            <td 
                key={ pointer }
                className={ isAnonymized && 'text-danger' }
            >
                { str }
            </td>
        ));
    }
    return out;
}

export default TableBodyCustomCols;
