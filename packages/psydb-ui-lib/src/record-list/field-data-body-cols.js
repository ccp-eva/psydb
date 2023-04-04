import React from 'react';
import { createDefaultFieldDataTransformer } from '@mpieva/psydb-common-lib';
import { TableBodyCustomCols } from '@mpieva/psydb-ui-layout';
import { fixRelated, __fixDefinitions } from '@mpieva/psydb-ui-utils';

// FIXME: compat
// TODO: remove
const FieldDataBodyCols = ({
    record,
    definitions,
    related,
    timezone,
    
    wrapAsLinkTo,

    // FIXME
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,
}) => {

    if (!definitions) {
        definitions = __fixDefinitions(displayFieldData)
    }
    if (!related) {
        var related = fixRelated({
            relatedRecordLabels,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,
        }, { isResponse: false });
    }
    
    var transformer = createDefaultFieldDataTransformer({
        related,
        timezone,
    })

    return (
        <TableBodyCustomCols
            record={ record }
            definitions={ definitions }
            transformer={ transformer }
            wrapAsLinkTo={ wrapAsLinkTo }
        />
    )
}

export default FieldDataBodyCols;
