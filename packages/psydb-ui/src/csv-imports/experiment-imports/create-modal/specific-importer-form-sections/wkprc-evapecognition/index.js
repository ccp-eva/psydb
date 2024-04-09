import React, { useState } from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { AsyncButton, LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { UploadModalBody } from '@mpieva/psydb-ui-lib';

import {
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib/src/formik';

import { CSVUploadField } from '../helper-fields';
import WKPRCWorkflowLocationTypeSelect from './wkprc-workflow-location-type-select';

export const WKPRCEVApeCognition = (ps) => {
    var { studyId, subjectType } = ps;
    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate', 'onFailedUpdate'
    ]});

    var translate = useUITranslation();

    var [ file, setFile ] = useState();
    var onSuccessfulFileUpload = (responseData) => {
        setFile(responseData.records[0]);
    }


    return (
        <DefaultForm
            initialValues={{}}
        >
            { (formik) => {
                var { values } = formik;
                var { locationType } = values['$'];
                return (
                    <>
                        <WKPRCWorkflowLocationTypeSelect
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

                        <CSVUploadField
                            label={ translate('File') }
                            dataXPath='$.file'
                        />
                    </>
                )
            }}
        </DefaultForm>
    )
}
