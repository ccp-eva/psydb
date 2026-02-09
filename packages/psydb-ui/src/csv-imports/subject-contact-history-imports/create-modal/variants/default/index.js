import React, { useState } from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Button, SmallFormFooter } from '@mpieva/psydb-ui-layout';
import { DefaultForm } from '@mpieva/psydb-ui-lib/src/formik';

import CSVUploadField from '../../../../csv-upload-field';
import PreviewStage from './preview-stage';

export const DefaultVariant = (ps) => {
    var { subjectType, stage, setStage } = ps;
    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate', 'onFailedUpdate'
    ]});

    var [{ translate }] = useI18N();
    var initialValues = {
        //fileId: '6985b192d1058599fa7e97c2',
    }

    return (
        <DefaultForm
            initialValues={ initialValues }
        >
            { (formik) => {
                var { values } = formik;
                var stageBag = {
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
    var { subjectType, formValues, gotoPreview } = ps;
    var { fileId } = formValues['$'];

    var [{ translate }] = useI18N();

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
