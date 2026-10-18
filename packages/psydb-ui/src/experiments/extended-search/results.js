import React from 'react';
import { ExtendedRecordList } from '@mpieva/psydb-ui-lib';
import sanitizeFormData from './sanitize-form-data';

export const Results = (ps) => {
    var { formData } = ps;
        
    var saneData = sanitizeFormData(formData);
    return (
        <ExtendedRecordList
            collection='experiment'
            formData={ saneData }
            enableCSVExport={ false }
            rowClassName={ getRowClassName }
        />
    )
}

const getRowClassName = (record) => {
    var { isCanceled, isPostprocessed } = record.state || {};
    if (isCanceled) {
        return 'text-danger';
    }
    if (!isPostprocessed) {
        return 'text-orange';
    }
    return '';
}
