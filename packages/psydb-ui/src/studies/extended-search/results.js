import React from 'react';
import { ExtendedRecordList } from '@mpieva/psydb-ui-lib';
import sanitizeFormData from './sanitize-form-data';

export const Results = (ps) => {
    var { schema, crtSettings, formData } = ps;
    var { fieldDefinitions } = crtSettings;
    var { columns } = formData;
        
    var saneData = sanitizeFormData(fieldDefinitions, formData);
    return (
        <ExtendedRecordList
            collection='study'
            crtSettings={ crtSettings }
            formData={ saneData }
        />
    )
}
