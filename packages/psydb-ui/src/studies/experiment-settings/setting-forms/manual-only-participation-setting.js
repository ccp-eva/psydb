import React from 'react';
import { keys, keyBy } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend, useFetch } from '@mpieva/psydb-ui-hooks';
import { Button, LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib/src/formik';

const defaultValues = {
    locationTypeKeys: [],
}

export const ManualOnlyParticipationSetting = (ps) => {
    var {
        op,
        studyId,
        variantId,
        settingRecord,
        settingRelated,

        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;

    var translate = useUITranslation();

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

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.readCustomRecordTypeMetadata()
    }, [])

    var send = useSend((formData, formikProps) => {
        var type = `experiment-variant-setting/manual-only-participation/${op}`;
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
            <DefaultForm
                onSubmit={ send.exec }
                initialValues={ settingState || defaultValues }
            >
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
                            <Fields.GenericEnum { ...({
                                dataXPath: '$.subjectTypeKey',
                                label: translate('Subject Type'),
                                required: true,
                                options: allowedSubjectTypes
                            })} />

                            <Fields.LocationTypeKeyList { ...({
                                dataXPath: '$.locationTypeKeys',
                                label: translate('Locations'),
                                allowedTypes: keys(allowedLocationTypes),
                                disabled: !selectedType,
                            })} />

                            <Button type='submit'>
                                { translate('Save') }
                            </Button>
                        </>
                    );
                }}
            </DefaultForm>
        </div>
    )
};
