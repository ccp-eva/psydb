import React, { useState } from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator, Alert } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';
import MainForm from './main-form';

const CRTSelectionWrapper = (ps) => {
    var { studyId, onSuccessfulUpdate } = ps;
    var [ studyType, setStudyType ] = useState('default');
    var [ subjectType, setSubjectType ] = useState('child');
    var [{ translate, language }] = useI18N();

    return (
        <div>
            <Controls.GenericTypeKey
                value={ studyType }
                onChange={ setStudyType }
                collection='subject'
            />
            <Controls.GenericTypeKey
                value={ subjectType }
                onChange={ setSubjectType }
                collection='subject'
            />
            <hr />
            { (studyType && subjectType) ? (
                <FullRecordCreator
                    studyId={ studyId }
                    onSuccessfulUpdate={ onSuccessfulUpdate }
                    subjectCRT={ crts.find({ type: subjectType }) }
                />
            ) : (
                <Alert variant='info'><i>
                    { translate('Please select a study and subject type.') }
                </i></Alert>
            )}
        </div>
    )
}

const FullRecordCreator = (ps) => {
    var { studyType, subjectType, onSuccessfulUpdate } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.crtSettings.readMany({ items: [
            { collection: 'subject', recordType: subjectType }
        ]})
    ), [ subjectType ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { crtSettings } = fetched.data;

    var send = useSend((formData) => {
        var { elements, ...pass } = formData;
        return {
            type: 'study-consent-template/create',
            payload: {
                studyId, subjectType,
                props: { elements: sanitizeElements(elements), ...pass }
            }
        }
    }, { onSuccessfulUpdate });

    var initialValues = MainForm.createDefaults();
    return (
        <MainForm.Component
            subjectCRT={ subjectCRT }
            initialValues={ initialValues }
            onSubmit={ send.exec }
        />
    );
}

// FIXME: can we make this obsolete n an easy manner?
const sanitizeElements = (elements) => {
    var out = [];
    var defaults = {
        'info-text-markdown': {
            markdown: '', markdownI18N: { 'de': '' }
        },
        'extra-field': {
            displayName: '', displayNameI18N: { 'de': '' }
        },
        'subject-field': {},
        'hr': {},
    };
    
    for (var it of elements) {
        var { type } = it;
        if (type) {
            out.push({ ...defaults[type], ...it });
        }
        else {
            out.push(it)
        }
    }

    return out;
}

export default CRTSelectionWrapper;
