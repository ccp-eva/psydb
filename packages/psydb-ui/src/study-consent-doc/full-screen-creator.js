import React from 'react';
import { useHistory } from 'react-router';
import { useURLSearchParamsB64 } from '@mpieva/psydb-ui-hooks';
import { Alert, A4Wrapper } from '@mpieva/psydb-ui-layout';

import RecordCreator from './record-creator';

const FullScreenCreator = (ps) => {
    var history = useHistory();
    var [ query ] = useURLSearchParamsB64();
    var {
        studyId, studyConsentFormId, subjectId, labOperatorIds,
        experimentId = undefined,
    } = query;
    
    if (!(
        studyId && studyConsentFormId && subjectId
        && labOperatorIds?.length
    )) {
        return (
            <Alert variant='danger'>
                <b>ERROR: Incomplete Query!</b>
            </Alert>
        )
    }

    return (
        <A4Wrapper className='bg-light border'>
            <RecordCreator.Inner
                studyConsentFormId={ studyConsentFormId }
                subjectId={ subjectId }
                labOperatorIds={ labOperatorIds }
                experimentId={ experimentId }

                onSuccessfulUpdate={ () => history.replace(
                    '/full-screen/study-consent-doc/success'
                ) }
            />
        </A4Wrapper>
    )
}

export default FullScreenCreator;
