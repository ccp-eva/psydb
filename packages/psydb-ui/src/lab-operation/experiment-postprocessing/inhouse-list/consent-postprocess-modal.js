import React from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import {
    WithDefaultModal,
    LoadingIndicator,
    Grid,
    SmallFormFooter,
    Button,
    Alert,
} from '@mpieva/psydb-ui-layout';

import { PostprocessSubjectForm } from '@mpieva/psydb-ui-lib';
import { RecordEditor as SubjectEditor } from '@mpieva/psydb-ui-record-views/subjects';
import { RecordDetails as ConsentDetails } from '../../../study-consent-doc';

const ConsentPostprocessModalBody = (ps) => {
    var { onHide, modalPayloadData, onSuccessfulUpdate } = ps;
    var { experimentRecord, subjectId } = modalPayloadData;

    var { _id: experimentId, _enableFollowUpExperiments } = experimentRecord;

    var [ didFetch, fetched] = useFetch((agent) => {
        return agent.studyConsentDoc.readByExperimentAndSubject({
            experimentId, subjectId,
        })
    }, []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record: studyConsentDoc, subjectCRT } = fetched.data;

    return (
        <div>
            <PostprocessSubjectForm { ...({
                experimentId, subjectId,
                enableFollowUpExperiments: _enableFollowUpExperiments,
                onSuccessfulUpdate,
            }) } />
            { studyConsentDoc ? (
                <Grid cols={[ '1fr', '1fr' ]} gap='1rem' className='mt-3'>
                    <div className='bg-light border p-4'>
                        <SubjectEditor
                            collection='subject'
                            recordType={ subjectCRT.type }
                            id={ subjectId }
                            onSuccessfulUpdate={ onSuccessfulUpdate }
                            renderFormBox={ false }
                        />
                    </div>
                    <div className='bg-light border p-4'>
                        <ConsentDetails.Inner
                            record={ studyConsentDoc }
                            subjectCRT={ subjectCRT }
                        />
                    </div>
                </Grid>
            ) : (
                <Alert variant='danger'>
                    <b>{ translate('No consent found!') }</b>
                </Alert>
            )}
        </div>
    )
}

const ConsentPostprocessModal = WithDefaultModal({
    title: 'Postprocessing',
    size: 'xl',
    bodyClassName: 'bg-white pt-3 pr-3 pl-3',
    Body: ConsentPostprocessModalBody,
});

export default ConsentPostprocessModal;
