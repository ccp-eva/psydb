import React from 'react';
import { useSend, useFetch } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import {
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib/src/formik';

export const OnlineSurveySetting = (ps) => {
    var {
        op,
        studyId,
        variantId,
        settingRecord,

        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;

    var settingId, settingState;
    if (settingRecord) {
        ({
            _id: settingId,
            state: settingState,
        } = settingRecord)
    }
    if (![ 'create', 'patch' ].includes(op)) {
        throw new Error(`unknown op "${op}"`);
    }

    var send = useSend((formData, formikProps) => {
        var type = `experiment-variant-setting/online-survey/${op}`;
        var message;
        switch (op) {
            case 'create':
                message = { type, payload: {
                    studyId,
                    experimentVariantId: variantId,
                    props: formData
                } };
                break;
            case 'patch':
                message = { type, payload: {
                    id: settingId,
                    props: formData
                }};
                break;
            default:
                throw new Error(`unknown op "${op}"`);
        }
        return message;
    }, { onSuccessfulUpdate });

    return (
        <div>
            <DefaultForm onSubmit={ send.exec }>
                {(formikProps) => (
                    <>
                        <Fields.GenericEnum { ...({
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
