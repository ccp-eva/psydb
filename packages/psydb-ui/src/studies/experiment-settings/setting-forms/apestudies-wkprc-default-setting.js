import React from 'react';
import { keys, keyBy } from '@mpieva/psydb-core-utils';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useSend, useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    AsyncButton,
    SmallFormFooter
} from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib/src/formik';

const defaultValues = {
    locationTypeKeys: [],
}

export const ApestudiesWKPRCDefaultSetting = (ps) => {
    var {
        onHide,
        onSubmit,
        isTransmitting,

        studyId,
        variantId,
        settingRecord,
        settingRelated,

        allowedSubjectTypes,
        availableSubjectCRTs,
        onSuccessfulUpdate
    } = ps;

    var settingId, settingState;
    if (settingRecord) {
        ({
            _id: settingId,
            state: settingState,
        } = settingRecord)
    }

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.readCustomRecordTypeMetadata()
    }, [])

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var { customRecordTypes } = fetched.data;

    var allowedLocationTypes = (
        customRecordTypes
        .filter(it => it.collection === 'location')
        .map(it => it.type)
    )

    var bodyBag = {
        availableSubjectCRTs,
        isTransmitting,
        onHide,

        allowedLocationTypes
    }

    return (
        <div>
            <DefaultForm
                onSubmit={ onSubmit }
                initialValues={ settingState || defaultValues }
            >
                {(formik) => (
                    <FormBody formik={ formik } { ...bodyBag } />
                )}
            </DefaultForm>
        </div>
    )
};

const FormBody = (ps) => {
    var {
        formik, availableSubjectCRTs, isTransmitting,
        allowedLocationTypes
    } = ps;
    var { getFieldProps } = formik;

    var language = useUILanguage();
    var translate = useUITranslation();

    var selectedSubjectType = getFieldProps('$.subjectTypeKey').value;

    return (
        <>
            <Fields.GenericEnum { ...({
                dataXPath: '$.subjectTypeKey',
                label: translate('Subject Type'),
                required: true,
                options: availableSubjectCRTs.asOptions({ language })
            })} />

            <Fields.LocationTypeKeyList { ...({
                dataXPath: '$.locationTypeKeys',
                label: translate('Locations'),
                allowedTypes: allowedLocationTypes,
                disabled: !selectedSubjectType,
            })} />

            <SmallFormFooter extraClassName='pt-2'>
                <AsyncButton type='submit' isTransmitting={ isTransmitting }>
                    { translate('Save') }
                </AsyncButton>
            </SmallFormFooter>
        </>
    )
}
