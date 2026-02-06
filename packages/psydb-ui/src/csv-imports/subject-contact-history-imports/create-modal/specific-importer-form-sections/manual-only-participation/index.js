import React, { useState } from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Alert, Button, SmallFormFooter } from '@mpieva/psydb-ui-layout';
import { UploadModalBody } from '@mpieva/psydb-ui-lib';

import {
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib/src/formik';

import CSVUploadField from '../../../../csv-upload-field';
import WorkflowLocationTypeSelect from './workflow-location-type-select';
import PreviewStage from './preview-stage';

export const ManualOnlyParticipation = (ps) => {
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
    var {
        locationType,
        locationId,
        labOperatorIds = [],
        fileId,
    } = formValues['$'];

    var translate = useUITranslation();

    return (
        <>
            <WorkflowLocationTypeSelect
                label={ translate('Location Type') }
                dataXPath='$.locationType'
                studyId={ studyId }
                subjectType={ subjectType }
            />
            <hr />
            { locationType ? (
                <CSVUploadField
                    label={ translate('Upload File') }
                    dataXPath='$.fileId'
                />
            ) : (
                <Alert variant='info'>
                    <i>
                        Please select Location
                    </i>
                </Alert>
            )}
            <hr />
            <SmallFormFooter>
                <Button disabled={ !fileId } onClick={ gotoPreview }>
                    { translate('Next') }
                </Button>
            </SmallFormFooter>
        </>
    )
}

var filterTruthy = (ary) => ary.filter(it => !!it);
