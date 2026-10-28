import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import {
    WithDefaultModal,
    LoadingIndicator,
    Grid,
    SmallFormFooter,
    Button,
    Alert,
    A4Wrapper,
} from '@mpieva/psydb-ui-layout';

import { RecordEditor as SubjectEditor } from '@mpieva/psydb-ui-record-views/subjects';
import {
    RecordDetails as ConsentDetails,
    MainForm as ConsentMainForm,
} from '../../../../study-consent-doc';

import FlagAndCommentForm from './flag-and-comment-form';

const ConsentPostprocessModalBody = (ps) => {
    var { onHide, modalPayloadData, onSuccessfulUpdate } = ps;
    var { studyConsentDocId } = modalPayloadData;
    var [{ translate }] = useI18N();

    var [ didFetch, fetched] = useFetch((agent) => {
        return agent.studyConsentDoc.read({
            studyConsentDocId
        })
    }, [ studyConsentDocId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record: studyConsentDoc, subjectCRT } = fetched.data;
    var {
        _rohrpostMetadata, subjectId, studyId,
        labOperatorIds, consentObtainedBy
    } = studyConsentDoc;

    return studyConsentDoc ? (
        <Grid
            cols={[ '1fr', '1fr' ]} gap='1rem'
            style={{ height: 'calc(100vh - 200px)' }}
        >
            <div
                className='d-flex flex-column'
                style={{ height: 'calc(100vh - 200px)' }}
            >
                <div>
                    <MetadataEditor
                        record={ studyConsentDoc }
                        onSuccessfulUpdate={[ onSuccessfulUpdate, onHide ]}
                    />
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <div className='bg-light border p-4'>
                        <A4Wrapper
                            wrapperClassName=''
                            pageMargin='5mm'
                        >
                            <ConsentMainForm.InfoBox
                                studyId={ studyId }
                                labOperatorIds={ labOperatorIds }
                                consentObtainedBy={ consentObtainedBy }
                                date={ _rohrpostMetadata.createdAt }
                            />
                            <ConsentDetails.Inner
                                record={ studyConsentDoc }
                                subjectCRT={ subjectCRT }
                            />
                        </A4Wrapper>
                    </div>
                </div>
            </div>
            <div className='bg-light border p-4' style={{
                overflowX: 'auto'
            }}>
                <SubjectEditor
                    collection='subject'
                    recordType={ subjectCRT.type }
                    id={ subjectId }
                    onSuccessfulUpdate={ onSuccessfulUpdate }
                    renderFormBox={ false }
                />
            </div>
        </Grid>
    ) : (
        <div>
            <Alert variant='danger'>
                <b>{ translate('No consent found!') }</b>
            </Alert>
        </div>
    )
}

const MetadataEditor = (ps) => {
    var { record, onSuccessfulUpdate } = ps;
    var { _id, state } = record;
    var {
        hasIssue = 'unknown',
        containsSubjectUpdate = 'unknown',
        comment = ''
    } = state;
    
    var send = useSend((formData) => ({
        type: 'study-consent-doc/flag-and-comment',
        payload: { _id, props: formData }
    }), { onSuccessfulUpdate });

    return (
        <div className='bg-light border p-3 mb-3'>
            <FlagAndCommentForm.Component
                initialValues={{ hasIssue, containsSubjectUpdate, comment }}
                onSubmit={ send.exec }
            />
        </div>
    )

}

const ConsentPostprocessModal = WithDefaultModal({
    title: 'Postprocess Consent Doc',
    size: 'xxl',
    bodyClassName: 'bg-white pt-3 pr-3 pl-3',
    Body: ConsentPostprocessModalBody,
});

export default ConsentPostprocessModal;
