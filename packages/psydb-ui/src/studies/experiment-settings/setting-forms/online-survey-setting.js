import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import {
    LoadingIndicator,
    AsyncButton,
    SmallFormFooter
} from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib/src/formik';

export const OnlineSurveySetting = (ps) => {
    var {
        onHide,
        onSubmit,
        isTransmitting,

        settingRecord,
        availableSubjectCRTs,
    } = ps;

    var [{ language, translate }] = useI18N();

    var settingId, settingState;
    if (settingRecord) {
        ({
            _id: settingId,
            state: settingState,
        } = settingRecord)
    }

    var bodyBag = {
        availableSubjectCRTs,
        isTransmitting,
        onHide,
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

const FormBody = (ps) => {
    var {
        formik,
        availableSubjectCRTs,

        isTransmitting,
        onHide,
    } = ps;

    var [{ language, translate }] = useI18N();

    return (
        <>
            <Fields.GenericEnum { ...({
                dataXPath: '$.subjectTypeKey',
                label: translate('Subject Type'),
                required: true,
                options: availableSubjectCRTs.asOptions({ language })
            })} />
            
                <SmallFormFooter extraClassName='pt-2'>
                <AsyncButton type='submit' isTransmitting={ isTransmitting }>
                    { translate('Save') }
                </AsyncButton>
            </SmallFormFooter>
        </>
    )
}
