import React from 'react';
import { createSend } from '@mpieva/psydb-ui-utils';
import { Button } from '@mpieva/psydb-ui-layout';
import {
    DefaultForm,
    GenericEnumField,
} from '@mpieva/psydb-ui-lib/src/formik';

export const OnlineSurveySetting = (ps) => {
    var {
        op,
        settingId,
        lastKnownEventId,
        studyId,
        variantId,

        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;

    if (![ 'create', 'patch' ].includes(op)) {
        throw new Error(`unknown op "${op}"`);
    }

    var handleSubmit = createSend((formData, formikProps) => {
        var type = `experiment-variant-setting/online-survey/${op}`;
        var message;
        switch (op) {
            case 'create':
                message = { type, payload: {
                    studyId,
                    experimentVariantId: variantId,
                    props: formData['$']
                } };
                break;
            case 'patch':
                message = { type, payload: {
                    id: settingId,
                    lastKnownEventId,
                    props: formData['$']
                }};
                break;
            default:
                throw new Error(`unknown op "${op}"`);
        }
        return message;
    }, { onSuccessfulUpdate });

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
                        <Button type='submit'>
                            Speichern
                        </Button>
                    </>
                )}
            </DefaultForm>
        </div>
    )
};
