import React from 'react';
import { createSend } from '@mpieva/psydb-ui-utils';
import { Button } from '@mpieva/psydb-ui-layout';
import {
    DefaultForm,
    GenericEnumField,
} from '@mpieva/psydb-ui-lib/src/formik';

const InhouseSetting = (ps) => {
    var {
        variantId,
        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;

    return (
        <div>
            <DefaultForm>
                {(formikProps) => (
                    <SaneStringField path='foo' />
                )}
            </DefaultForm>
        </div>
    )
};

const AwayTeamSetting = (ps) => {
    var {
        variantId,
        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;
    return (
        <div>AWAY</div>
    )
};

const OnlineVideoCallSetting = (ps) => {
    var {
        variantId,
        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;
    return (
        <div>Video</div>
    )
};

const OnlineSurveySetting = (ps) => {
    var {
        studyId,
        variantId,
        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;

    var handleSubmit = createSend((formData, formikProps) => ({
        type: 'experiment-variant-setting/online-survey/create',
        payload: {
            studyId,
            experimentVariantId: variantId,
            props: formData['$']
        } 
    }), { onSuccessfulUpdate });

    return (
        <div>
            <DefaultForm onSubmit={ handleSubmit }>
                {(formikProps) => (
                    <>
                        <GenericEnumField { ...({
                            dataXPath: '$.subjectTypeKey',
                            label: 'Probandentyp',
                            required: true,
                            options: allowedSubjectTypes
                        })} />
                        <Button type='submit'>Hinzufügen</Button>
                    </>
                )}
            </DefaultForm>
        </div>
    )
};

export {
    InhouseSetting,
    AwayTeamSetting,
    OnlineVideoCallSetting,
    OnlineSurveySetting
}
