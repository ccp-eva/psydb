import React, { useState } from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib/src/formik';

import PrepareStage from './prepare-stage';
import PreviewStage from './preview-stage';

const SubjectImportCreateForm = (ps) => {
    
    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate', 'onFailedUpdate'
    ]});

    var translate = useUITranslation();
    var [ stage, setStage ] = useState('prepare');

    var initialValues = {
        subjectType: 'fs_malaysia_subject',
        researchGroupId: '64d42dd0443aa279ca4caff8',
        //fileId: '661841402e082ffc470d006f',
        //fileId: '662aebf39d1d9d8b8eb3c5fc'
        fileId: '66d4dc510a3b62187bce775b',
    }

    return (
        <DefaultForm
            initialValues={ initialValues }
        >
            { (formik) => {
                var { values } = formik;
                var stageBag = {
                    formValues: values,
                    gotoPrepare: () => setStage('prepare'),
                    gotoPreview: () => setStage('preview'),
                    ...triggerBag
                }
                if (stage === 'preview') {
                    return <PreviewStage { ...stageBag } />
                }
                else {
                    return <PrepareStage { ...stageBag } />
                }
            }}
        </DefaultForm>
    )
}

export default SubjectImportCreateForm;
