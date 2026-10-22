import React, { useState } from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useSend } from '@mpieva/psydb-ui-hooks';

import { Alert, FormBox, FormHelpers } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';
import MainForm from './main-form';

const CRTSelectionWrapper = (ps) => {
    var { onSuccessfulUpdate } = ps;
    var [ studyType, setStudyType ] = useState();
    var [ subjectType, setSubjectType ] = useState();
    var [{ translate }] = useI18N();

    return (
        <FormBox title={ translate('New Email Meta Template') }>
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
    var permissions = usePermissions();

    var send = useSend((formData) => ({
        type: 'study-email-meta-template/create',
        payload: { studyType, subjectType, props: formData }
    }), { onSuccessfulUpdate: () => onSuccessfulUpdate() });

    var initialValues = MainForm.createDefaults({ permissions });
    return (
        <MainForm.Component
            initialValues={ initialValues }
            onSubmit={ send.exec }
        />
    );
}

export default CRTSelectionWrapper;
