import React from 'react';
import { createDefaultFieldDataTransformer } from '@mpieva/psydb-common-lib';
import { fixRelated, __fixDefinitions } from '@mpieva/psydb-ui-utils';
import { useUILocale } from '@mpieva/psydb-ui-contexts';
import { TableBodyCustomCols } from '@mpieva/psydb-ui-layout';

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

    var locale = useUILocale();

    if (!definitions) {
        definitions = __fixDefinitions(displayFieldData)
    }
    if (!related) {
        related = fixRelated({
            relatedRecordLabels,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,
        }, { isResponse: false });
    }
    
    var transformer = createDefaultFieldDataTransformer({
        related,
        timezone,
        locale,
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
