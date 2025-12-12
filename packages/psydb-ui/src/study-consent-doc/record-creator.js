import React, { useState } from 'react';

import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useFetchChain, useSend } from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator, Alert, LinkQ64, Grid, A4Wrapper }
    from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';
import { RecordPicker } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const FormSelectionWrapper = (ps) => {
    var {
        studyId,
        studyConsentFormId: props_studyConsentFormId,
        subjectId: props_subjectId,
        labOperatorIds: props_labOperatorIds,
        experimentId = undefined,
        enableFullScreenLink = false,
        onSuccessfulUpdate
    } = ps;
    
    var [ studyConsentFormId, setStudyConsentFormId ] = useState(
        //'69241bc4b88e9704906d6942'
    );
    var [ subjectId, setSubjectId ] = useState(
        //'64d42dcb443aa279ca4caede'
    );
    var [ labOperatorIds, setLabOperatorIds ] = useState([
        //
    ]);
    var [{ translate, language }] = useI18N();

    studyConsentFormId = props_studyConsentFormId || studyConsentFormId;
    subjectId = props_subjectId || subjectId;
    labOperatorIds = props_labOperatorIds || labOperatorIds;

    return (
        <div>
            <Grid cols={[ '200px', '1fr' ]} gap='1rem' style={{
                placeItems: 'center stretch'
            }}>
                { !props_studyConsentFormId && (
                    <>
                        <b>{ translate('Consent Form') }</b>
                        <StudyConsentFormSelect
                            studyId={ studyId }
                            value={ studyConsentFormId }
                            onChange={ setStudyConsentFormId }
                        />
                    </>
                )}
                { (studyConsentFormId && !props_subjectId) && (
                    <>
                        <b>{ translate('Subject') }</b>
                        <SubjectPicker
                            studyConsentFormId={ studyConsentFormId }
                            value={{ _id: subjectId }}
                            onChange={ (record) => (
                                setSubjectId(record._id || record)
                            )}
                        />
                    </>
                )}
                { (studyConsentFormId && !props_labOperatorIds?.length) && (
                    <>
                        <b>{ translate('Lab Operator') }</b>
                        <PersonnelPicker
                            value={{ _id: labOperatorIds[0] }}
                            onChange={ (record) => (
                                setLabOperatorIds([ record._id || record ])
                            )}
                        />
                    </>
                )}
            </Grid>

            { (
                studyConsentFormId && subjectId && labOperatorIds?.length > 0
                && enableFullScreenLink
            ) && (
                <div className='d-flex justify-content-end mt-3'>
                    <LinkQ64
                        className='btn btn-primary btn-sm m-0'
                        href='#/full-screen/study-consent-doc/fill'
                        target='_blank'
                        payload={{
                            studyId, subjectId, labOperatorIds,
                            studyConsentFormId,
                        }}
                    >
                        { translate('Go Fullscreen ->') }
                    </LinkQ64>
                </div>
            )}
            { (
                !props_studyConsentFormId || !props_subjectId
                || !props_labOperatorIds
            ) && (
                <hr />
            )}
            { (!studyConsentFormId) ? (
                <Alert variant='info'><i>
                    { translate('Please select a consent form.') }
                </i></Alert>
            ) : (!subjectId) ? (
                <Alert variant='info'><i>
                    { translate('Please select a subject.') }
                </i></Alert>
            ) : (labOperatorIds?.length < 1) ? (
                <Alert variant='info'><i>
                    { translate('Please select a lab operator.') }
                </i></Alert>
            ) : (
                <div className='bg-white border'>
                    <A4Wrapper className='bg-light border'>
                        <FullRecordCreator
                            studyConsentFormId={ studyConsentFormId }
                            subjectId={ subjectId }
                            labOperatorIds={ labOperatorIds }
                            experimentId={ experimentId }
                            onSuccessfulUpdate={ onSuccessfulUpdate }
                        />
                    </A4Wrapper>
                </div>
            )}
        </div>
    )
}

const StudyConsentFormSelect = (ps) => {
    var { studyId, value, onChange } = ps;
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.studyConsentForm.list({
            //target: 'option-list', // FIXME
            constraints: { '/studyId': studyId },
            offset: 0, limit: 1000,
        })
    ), [ studyId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records } = fetched.data;
    var options = {};
    for (var it of records) {
        options[it._id] = it.state.internalName;
    }

    return (
        <Controls.GenericEnum
            value={ value } onChange={ onChange }
            options={ options }
        />
    )
}

const SubjectPicker = (ps) => {
    var { studyConsentFormId, value, onChange } = ps;
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.studyConsentForm.read({ studyConsentFormId })
    ), [ studyConsentFormId ]);
    
    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record } = fetched.data;
    var { subjectType } = record;

    return (
        <div>
            <RecordPicker
                value={ value }
                onChange={ onChange }
                collection='subject'
                recordType={ subjectType }
            />
        </div>
    )
}

const PersonnelPicker = (ps) => {
    var { value, onChange } = ps;
    
    return (
        <div>
            <RecordPicker
                value={ value }
                onChange={ onChange }
                collection='personnel'
            />
        </div>
    )
}

const FullRecordCreator = (ps) => {
    var {
        studyConsentFormId,
        subjectId, labOperatorIds, experimentId = undefined,
        onSuccessfulUpdate
    } = ps;

    var send = useSend((formData) => {
        var { elements, ...pass } = formData;
        return { type: 'study-consent-doc/create', payload: {
            studyConsentFormId, subjectId, labOperatorIds, experimentId,
            props: { ...formData }
        }}
    }, { onSuccessfulUpdate });

    var [ didFetch, fetched ] = useFetchChain(() => ([
        ({ agent }) => ({ studyConsentForm: (
            agent.studyConsentForm.read({ studyConsentFormId })
        )}),
        ({ agent, context }) => ({ subject: (
            agent.readRecord({
                collection: 'subject',
                recordType: context.studyConsentForm.data.record.subjectType,
                id: subjectId
            })
        )}),
    ]), [ studyConsentFormId, subjectId ]);
    
    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { studyConsentForm, subject } = fetched._stageDatas;
    var related = { ...subject.related } // FIXME: full merge

    var { subjectCRT } = studyConsentForm;
    subjectCRT = CRTSettings({ data: subjectCRT });

    var initialValues = MainForm.createDefaults({
        subject: subject.record,
        studyConsentForm: studyConsentForm.record,
        subjectCRT,
    });
    return (
        <MainForm.Component
            studyConsentForm={ studyConsentForm.record }
            subjectCRT={ subjectCRT }
            initialValues={ initialValues }
            onSubmit={ send.exec }
        />
    );
}


// FIXME: i dont like 'Inner' as a name
FormSelectionWrapper.Inner = FullRecordCreator;

export default FormSelectionWrapper;
