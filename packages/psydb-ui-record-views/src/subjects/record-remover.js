import React from 'react';

import { withRecordRemover, FormBox } from '@mpieva/psydb-ui-lib';

const SafetyForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    return (
        <div>REM</div>
    )
}

const SuccessInfo = (ps) => {
    return (
        <div>success</div>
    )
}

export const RecordRemover = withRecordRemover({
    SafetyForm,
    SuccessInfo
});
