import React, { useState } from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator, Alert } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';
import MainForm from './main-form';

const CRTSelectionWrapper = (ps) => {
    var { studyId } = ps;
    var [ subjectType, setSubjectType ] = useState('child');
    var [{ translate, language }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchStudyAvailableSubjectCRTs({ studyId })
    ), [ studyId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { crts } = fetched.data;

    return (
        <div>
            <Controls.GenericEnum
                value={ subjectType }
                onChange={ setSubjectType }
                options={ crts.asOptions({ language }) }
            />
            <hr />
            { subjectType ? (
                <FullRecordCreator
                    studyId={ studyId }
                    subjectCRT={ crts.find({ type: subjectType }) }
                />
            ) : (
                <Alert variant='info'><i>
                    { translate('Please select a subject type.') }
                </i></Alert>
            )}
        </div>
    )
}

const FullRecordCreator = (ps) => {
    var { studyId, subjectCRT, onSuccessfulUpdate } = ps;

    var send = useSend((formData) => ({
        type: 'study-consent-form/create',
        payload: {
            studyId, subjectType: subjectCRT.getType(),
            props: { ...formData }
        }
    }));

    var initialValues = MainForm.createDefaults();
    return (
        <MainForm.Component
            subjectCRT={ subjectCRT }
            initialValues={ initialValues }
            onSubmit={ send.exec }
        />
    );
}

export default CRTSelectionWrapper;
