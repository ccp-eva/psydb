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
    SubjectFieldRequirementListField,
    TypedLocationIdListField,
} from '@mpieva/psydb-ui-lib/src/formik';

export const InhouseSetting = (ps) => {
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
        var type = `experiment-variant-setting/inhouse/${op}`;
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

    var allowedLocationTypes = (
        customRecordTypes
        .filter(it => it.collection === 'location')
        .reduce((acc, it) => ({
            ...acc,
            [it.type]: it.state.label
        }), {})
    )

    customRecordTypes = keyBy({
        items: customRecordTypes,
        byProp: 'type',
    });

    return (
        <div>
            <DefaultForm onSubmit={ handleSubmit }>
                {(formikProps) => {
                    var { getFieldProps } = formikProps;
                    var selectedType = (
                        getFieldProps('$.subjectTypeKey').value
                    );
                    
                    var subjectScientificFields = (
                        selectedType
                        ? (
                            customRecordTypes[selectedType].state
                            .settings.subChannelFields.scientific
                        )
                        : []
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
                                subjectScientificFields,
                                disabled: !selectedType
                            })} />

                            <TypedLocationIdListField { ...({
                                dataXPath: '$.locations',
                                label: 'Räumlichkeiten',
                                typeOptions: allowedLocationTypes,
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
