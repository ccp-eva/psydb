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
import WKPRCWorkflowLocationTypeSelect from './wkprc-workflow-location-type-select';
import PreviewStage from './preview-stage';

export const WKPRCEVApeCognition = (ps) => {
    var { studyId, subjectType, stage, setStage } = ps;
    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate', 'onFailedUpdate'
    ]});

    var translate = useUITranslation();
    var initialValues = {
        locationId: '64d42de0443aa279ca4cb2e8',
        labOperatorIds: [
            '64d42ddf443aa279ca4cb2c9',
            '64d42ddf443aa279ca4cb2c5',
        ],
        //fileId: '6671e48d90dbc5f198044a6e',
        //fileId: '6671e49790dbc5f198044a7a',
        //fileId: '667231822fd79bfccf89aa85',
        //fileId: '667233192fd79bfccf89aa87',
        //fileId: '66723d1b817c2304eae90802',
        fileId: '667264deb4217b27fb46948a',
        //labOperatorIds: []
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
            {/*<WKPRCWorkflowLocationTypeSelect
                label={ translate('Location Type') }
                dataXPath='$.locationType'
                studyId={ studyId }
                subjectType={ subjectType }
            />
            <Fields.ForeignId
                label={ translate('Location') }
                dataXPath='$.locationId'
                collection='location'
                recordType={ locationType }
            />
            <Fields.ForeignIdList
                label={ translate('Experimenters') }
                dataXPath='$.labOperatorIds'
                collection='personnel'
            />
            <hr />*/}
            { (locationId && filterTruthy(labOperatorIds).length > 0) ? (
                <CSVUploadField
                    label={ translate('Upload File') }
                    dataXPath='$.fileId'
                />
            ) : (
                <Alert variant='info'>
                    <i>
                        Please select Location and Experimenters
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
