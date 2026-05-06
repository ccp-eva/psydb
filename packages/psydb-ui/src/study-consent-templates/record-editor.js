import React, { useState } from 'react';
import { useParams } from 'react-router';

import { merge } from '@mpieva/psydb-core-utils';
import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator, FormBox } from '@mpieva/psydb-ui-layout';
import MainForm from './main-form';

const RecordEditor = (ps) => {
    var { onSuccessfulUpdate } = ps;
    var { id: studyConsentTemplateId } = useParams();
    var [{ translate }] = useI18N();

    var send = useSend((formData) => {
        var { elements, ...pass } = formData;
        return {
            type: 'study-consent-template/patch',
            payload: {
                studyConsentTemplateId,
                props: { elements: sanitizeElements(elements), ...pass }
            }
        }
    }, { onSuccessfulUpdate: (...args) => {
        var [ response, formik ] = args;
        //return onSuccessfulUpdate({ id: response.data.data[0].channelId })
        return onSuccessfulUpdate();
    }});

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.studyConsentTemplate.read({ studyConsentTemplateId })
    ), [ studyConsentTemplateId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, related, subjectCRT } = fetched.data;
    subjectCRT = CRTSettings({ data: subjectCRT });

    var initialValues = record.state;
    //var initialValues = merge(
    //    MainForm.createDefaults(),
    //    record.state
    //);
    
    return (
        <FormBox title={ translate('Edit Consent Template') }>
            <MainForm.Component
                subjectCRT={ subjectCRT }
                initialValues={ initialValues }
                onSubmit={ send.exec }
            />
        </FormBox>
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

export default RecordEditor;
