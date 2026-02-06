import React, { useState } from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button, SmallFormFooter } from '@mpieva/psydb-ui-layout';
import { DefaultForm } from '@mpieva/psydb-ui-lib/src/formik';

import CSVUploadField from '../../../../csv-upload-field';
import PreviewStage from './preview-stage';

export const OnlineSurvey = (ps) => {
    var { studyId, subjectType, stage, setStage } = ps;
    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate', 'onFailedUpdate'
    ]});

    var translate = useUITranslation();
    var initialValues = {
        //fileId: '66909c1e373d99dc8b8605be',
    }

    return (
        <DefaultForm
            initialValues={ initialValues }
        >
            { (formik) => {
                var { values } = formik;
                var stageBag = {
                    studyId,
                    subjectType,
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

const PrepareStage = (ps) => {
    var { studyId, subjectType, formValues, gotoPreview } = ps;
    var { fileId } = formValues['$'];

    var translate = useUITranslation();

    return (
        <>
            <CSVUploadField
                label={ translate('Upload File') }
                dataXPath='$.fileId'
            />
            <hr />
            <SmallFormFooter>
                <Button disabled={ !fileId } onClick={ gotoPreview }>
                    { translate('Next') }
                </Button>
            </SmallFormFooter>
        </>
    )
}
