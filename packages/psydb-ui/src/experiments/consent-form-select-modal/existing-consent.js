import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Alert, Button, LoadingIndicator, SmallFormFooter, A4Wrapper }
    from '@mpieva/psydb-ui-layout';

import { RecordDetails, MainForm } from '../../study-consent-doc';

const ExistingConsent = (ps) => {
    var { revision, deferredConsentDocFetch, onRefresh } = ps;
    var [ didFetch, fetched ] = deferredConsentDocFetch;

    var [{ translate }] = useI18N();

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, subjectCRT } = fetched.data;

    if (!record) {
        return (
            <div>
                <hr />
                <Alert variant='info'>
                    <i>{ translate('No consent found!') }</i>
                </Alert>
                <SmallFormFooter>
                    <Button onClick={ () => {
                        revision.up();
                        onRefresh && onRefresh();
                    }}>
                        { translate('Refresh') }
                    </Button>
                </SmallFormFooter>
            </div>
        )
    }
    else {
        return (
            <A4Wrapper className='bg-light border' wrapperClassName='py-0'>
                <MainForm.InfoBox
                    studyId={ record.studyId }
                    labOperatorIds={ record.labOperatorIds }
                    consentObtainedBy={ record.consentObtainedBy }
                    date={ record._rohrpostMetadata.createdAt }
                />
                <RecordDetails.Inner
                    record={ record }
                    subjectCRT={ subjectCRT }
                />
            </A4Wrapper>
        )
    }
}

export default ExistingConsent;
