import React from 'react';
import isSubset from 'is-subset';
import { keyBy } from '@mpieva/psydb-core-utils';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useSend, useFetch } from '@mpieva/psydb-ui-hooks';
import { Button, LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    useFormikContext,
} from '@mpieva/psydb-ui-lib/src/formik';

export const AwayTeamSetting = (ps) => {
    var {
        onSubmit,
        isTransmitting,

        studyId,
        variantId,
        settingRecord,

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

    var bodyBag = {
        availableSubjectCRTs,
        isTransmitting
    }

    return (
        <div>
            <DefaultForm
                onSubmit={ onSubmit }
                initialValues={ settingState || {}}
            >
                {(formik) => (
                    <FormBody formik={ formik } { ...bodyBag } />
                )}
            </DefaultForm>
        </div>
    )
};

var FormBody = (ps) => {
    var { formik, availableSubjectCRTs } = ps;
    var { getFieldProps } = formik;

    var language = useUILanguage();
    var translate = useUITranslation();

    var selectedSubjectType = getFieldProps('$.subjectTypeKey').value;
    var fieldOptions = {};
    console.log(selectedSubjectType);
    if (selectedSubjectType) {
        var selectedSubjectCRT = availableSubjectCRTs.find({
            type: selectedSubjectType
        });

        var defs = selectedSubjectCRT.findCustomFields({
            'isRemoved': { $ne: true },
            'systemType': 'ForeignId',
            'props.collection': 'location',
            // TODO: when we have
            // external/internal locations
            // we need to further filter that
            // NOTE: that todo still a thing?
        });
        for (var it of defs) {
            fieldOptions[it.pointer] = translate.fieldDefinition(it);
        }
    }
    
    return (
        <>
            <Fields.GenericEnum { ...({
                dataXPath: '$.subjectTypeKey',
                label: translate('Subject Type'),
                required: true,
                options: availableSubjectCRTs.asOptions({ language })
            })} />
            <Fields.GenericEnum { ...({
                dataXPath: '$.subjectLocationFieldPointer',
                label: translate('Appointments In'),
                required: true,
                options: fieldOptions,
                disabled: !selectedSubjectType
            })} />
            <Button type='submit'>
                { translate('Save') }
            </Button>
        </>
    );
}
