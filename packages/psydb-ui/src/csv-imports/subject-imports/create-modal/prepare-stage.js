import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Alert, Button, SmallFormFooter } from '@mpieva/psydb-ui-layout';
import { Fields } from '@mpieva/psydb-ui-lib/src/formik';

import CSVUploadField from '../../csv-upload-field';

const PrepareStage = (ps) => {
    var { formValues, gotoPreview } = ps;
    var {
        fileId,
        subjectType,
        researchGroupId,
    } = formValues['$'];

    var translate = useUITranslation();

    return (
        <>
            <Fields.GenericTypeKey
                label='Subject Type'
                collection='subject'
                dataXPath='$.subjectType'
            />
            <Fields.ForeignId
                label={ translate('Research Group') }
                dataXPath='$.researchGroupId'
                collection='researchGroup'
                constraints={{
                    '/state/subjectTypes/key': subjectType
                }}
            />
            <hr />
            { (researchGroupId && subjectType) ? (
                <CSVUploadField
                    label={ translate('Upload File') }
                    dataXPath='$.fileId'
                />
            ) : (
                <Alert variant='info'>
                    <i>
                        Please select Subject Type and Research Group
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

export default PrepareStage;
