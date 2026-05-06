import React, { useState } from 'react';

import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator, Alert, FormBox, FormHelpers }
    from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';
import MainForm from './main-form';

const CRTSelectionWrapper = (ps) => {
    var { studyId, onSuccessfulUpdate } = ps;
    var [ studyType, setStudyType ] = useState('default');
    var [ subjectType, setSubjectType ] = useState('child');
    var [{ translate }] = useI18N();

    return (
        <FormBox title={ translate('New Consent Template') }>
            <FormHelpers.InlineWrapper label={ translate('Study Type') }>
                <Controls.GenericTypeKey
                    value={ studyType }
                    onChange={ setStudyType }
                    collection='study'
                />
            </FormHelpers.InlineWrapper>

            <FormHelpers.InlineWrapper label={ translate('Subject Type') }>
                <Controls.GenericTypeKey
                    value={ subjectType }
                    onChange={ setSubjectType }
                    collection='subject'
                />
            </FormHelpers.InlineWrapper>

            <hr />

            { (studyType && subjectType) ? (
                <FullRecordCreator
                    studyType={ studyType }
                    subjectType={ subjectType }
                    onSuccessfulUpdate={ onSuccessfulUpdate }
                />
            ) : (
                <Alert variant='info'><i>
                    { translate('Please select a study and subject type.') }
                </i></Alert>
            )}
        </FormBox>
    )
}

const FullRecordCreator = (ps) => {
    var { studyType, subjectType, onSuccessfulUpdate } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.crtSettings.readMany({ items: [
            { collection: 'subject', recordType: subjectType }
        ]})
    ), [ subjectType ]);

    var send = useSend((formData) => {
        var { elements, ...pass } = formData;
        return {
            type: 'study-consent-template/create',
            payload: {
                studyType, subjectType,
                props: { elements: sanitizeElements(elements), ...pass }
            }
        }
    }, { onSuccessfulUpdate: (...args) => {
        var [ response, formik ] = args;
        //return onSuccessfulUpdate({ id: response.data.data[0].channelId })
        return onSuccessfulUpdate();
    } });

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { crtSettings } = fetched.data;
    var subjectCRT = CRTSettings({ data: crtSettings[0] });

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
