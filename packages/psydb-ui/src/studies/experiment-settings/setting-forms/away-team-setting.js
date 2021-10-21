import React from 'react';
import isSubset from 'is-subset';
import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import { createSend } from '@mpieva/psydb-ui-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { Button, LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    GenericEnumField,
} from '@mpieva/psydb-ui-lib/src/formik';

export const AwayTeamSetting = (ps) => {
    var {
        op,
        studyId,
        variantId,
        settingRecord,

        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;

    var settingId, lastKnownEventId, settingState;
    if (settingRecord) {
        ({
            _id: settingId,
            _lastKnownEventId: lastKnownEventId,
            state: settingState,
        } = settingRecord)
    }

    if (![ 'create', 'patch' ].includes(op)) {
        throw new Error(`unknown op "${op}"`);
    }

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.readCustomRecordTypeMetadata()
    }, [])

    var handleSubmit = createSend((formData, formikProps) => {
        var type = `experiment-variant-setting/away-team/${op}`;
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
                initialValues={ settingState || {}}
            >
                {(formikProps) => {
                    var { getFieldProps } = formikProps;
                    var selectedType = (
                        getFieldProps('$.subjectTypeKey').value
                    );
                    var fieldOptions = (
                        selectedType
                        ? (
                            customRecordTypes[selectedType].state.settings
                            .subChannelFields.scientific
                            .filter(it => (
                                !it.isRemoved &&
                                isSubset(it, {
                                    type: 'ForeignId',
                                    props: {
                                        collection: 'location'
                                        // TODO: when we have
                                        // external/internal locations
                                        // we need to further filter that
                                    }
                                })
                            ))
                            .reduce((acc, field) => {
                                var { key, displayName } = field;
                                var pointer = (
                                    `/scientific/state/custom/${key}`
                                );
                                return { ...acc, [pointer]: displayName };
                            }, {})
                        )
                        : {}
                    );

                    return (
                        <>
                            <GenericEnumField { ...({
                                dataXPath: '$.subjectTypeKey',
                                label: 'Probandentyp',
                                required: true,
                                options: allowedSubjectTypes
                            })} />
                            <GenericEnumField { ...({
                                dataXPath: '$.subjectLocationFieldPointer',
                                label: 'Termine in',
                                required: true,
                                options: fieldOptions,
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
