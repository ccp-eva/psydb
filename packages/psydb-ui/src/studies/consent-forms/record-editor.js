import React, { useState } from 'react';
import { useParams } from 'react-router';

import { merge } from '@mpieva/psydb-core-utils';
import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend, usePermissions } from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import MainForm from './main-form';
import { RemoveButton } from '../../study-consent-templates/remove-button';

const RecordEditor = (ps) => {
    var { onSuccessfulUpdate } = ps;
    var { id: studyConsentFormId } = useParams();
    var [{ translate }] = useI18N();
    var permissions = usePermissions();
    var canRemove = permissions.hasCollectionFlag('studyConsentForm', 'remove');

    var send = useSend((formData) => {
        var { elements, ...pass } = formData;
        return {
            type: 'study-consent-form/patch',
            payload: {
                studyConsentFormId,
                props: { elements: sanitizeElements(elements), ...pass }
            }
        }
    }, { onSuccessfulUpdate });

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.studyConsentForm.read({ studyConsentFormId })
    ), [ studyConsentFormId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, related, subjectCRT, studyConsentDocCount } = fetched.data;
    subjectCRT = CRTSettings({ data: subjectCRT });

    var initialValues = record.state;
    //var initialValues = merge(
    //    MainForm.createDefaults(),
    //    record.state
    //);
    
    return (
        <>
            <MainForm.Component
                subjectCRT={ subjectCRT }
                initialValues={ initialValues }
                onSubmit={ send.exec }
                isTransmitting={ send.isTransmitting }
            />
            { canRemove && (
                <div className='d-flex justify-content-end mt-3'>
                    <RemoveButton
                        title={ translate('Delete Consent Form') }
                        confirmText={ translate(
                            'Do you really want to delete this consent form?'
                        )}
                        blockedText={ studyConsentDocCount > 0 && (
                            translate('This consent form is already used by consent docs and cannot be deleted.')
                            + ` (${studyConsentDocCount})`
                        )}
                        createMessage={ () => ({
                            type: 'study-consent-form/remove',
                            payload: { studyConsentFormId }
                        })}
                        onSuccessfulUpdate={ () => onSuccessfulUpdate() }
                    />
                </div>
            )}
        </>
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
