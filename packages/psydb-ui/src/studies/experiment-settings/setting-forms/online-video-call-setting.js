import React from 'react';
import isSubset from 'is-subset';
import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import { createSend } from '@mpieva/psydb-ui-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { Button, LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    GenericEnumField,
    IntegerField,
    SubjectFieldRequirementListField
} from '@mpieva/psydb-ui-lib/src/formik';

const initialValues = {
    subjectsPerExperiment: 1,
    subjectFieldRequirements: [],
}

export const OnlineVideoCallSetting = (ps) => {
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

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.readCustomRecordTypeMetadata()
    }, [])

    var handleSubmit = createSend((formData, formikProps) => {
        var type = `experiment-variant-setting/online-video-call/${op}`;
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

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var { customRecordTypes } = fetched.data;
    customRecordTypes = keyBy({
        items: customRecordTypes,
        byProp: 'type',
    });

    return (
        <div>
            <DefaultForm
                onSubmit={ handleSubmit }
                initialValues={ initialValues }
            >
                {(formikProps) => {
                    var { getFieldProps } = formikProps;
                    var selectedType = (
                        getFieldProps('$.subjectTypeKey').value
                    );

                    return (
                        <>
                            <GenericEnumField { ...({
                                dataXPath: '$.subjectTypeKey',
                                label: 'Probandentyp',
                                required: true,
                                options: allowedSubjectTypes
                            })} />
                            <IntegerField { ...({
                                dataXPath: '$.subjectsPerExperiment',
                                label: 'Anzahl pro Termin',
                                required: true,
                                min: 1,
                                disabled: !selectedType
                            })} />
                            <SubjectFieldRequirementListField { ...({
                                dataXPath: '$.subjectFieldRequirements',
                                label: 'Terminbedingungen',
                                subjectScientificFields: (
                                    selectedType
                                    ? (
                                        customRecordTypes[selectedType].state
                                        .settings.subChannelFields.scientific
                                    )
                                    : []
                                ),
                                disabled: !selectedType
                            })} />
                            <Button type='submit'>
                                Speichern
                            </Button>
                        </>
                    );
                }}
            </DefaultForm>
        </div>
    )
};
