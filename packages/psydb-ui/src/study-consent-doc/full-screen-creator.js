import React from 'react';
import { useURLSearchParamsB64 } from '@mpieva/psydb-ui-hooks';
import { Alert } from '@mpieva/psydb-ui-layout';
import RecordCreator from './record-creator';

const FullScreenCreator = (ps) => {
    var [ query ] = useURLSearchParamsB64();
    var { studyId, studyConsentFormId, subjectId } = query;
    if (!(studyId && studyConsentFormId && subjectId)) {
        return (
            <Alert variant='danger'>
                <b>ERROR: Incomplete Query!</b>
            </Alert>
        )
    }
    return (
        <RecordCreator
            studyId={ studyId }
            studyConsentFormId={ studyConsentFormId }
            subjectId={ subjectId }
        />
    )
}

export default FullScreenCreator;
