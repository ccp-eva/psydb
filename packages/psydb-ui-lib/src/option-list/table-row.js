import React from 'react';
import { classnames } from '@mpieva/psydb-ui-utils';
import { OptionSelectIndicator } from '@mpieva/psydb-ui-layout';

const TableRow = (ps) => {
    var { record, related, definitions, onSelectRecord } = ps;
    var { _isHidden } = record;

    var className = classnames([
        _isHidden && 'bg-light text-grey'
    ]);

    return (
        <tr
            className={ className }
            role='button'
            onClick={() => onSelectRecord(record) }
        >
            <TableBodyCustomCols
                record={ record }
                related={ related }
                definitions={ definitions }
            />
            <td>
                <div className='d-flex justify-content-end pb-0 pt-0'>
                    <OptionSelectIndicator record={ record } />
                </div>
            </td>
        </tr>
    )
}

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields } from '@mpieva/psydb-custom-fields-common';

const TableBodyCustomCols = (ps) => {
    var { record, related, definitions } = ps;
    var [ i18n ] = useI18N();

    var out = [];
    for (var it of definitions) {
        var { systemType, pointer } = it;

        var field = Fields[systemType];
        var str = field.stringifyValue({ definition: it, record, i18n });

        out.push(
            <td key={ pointer }>{ str }</td>
        );
    }
    return out;
}

export default TableRow;
