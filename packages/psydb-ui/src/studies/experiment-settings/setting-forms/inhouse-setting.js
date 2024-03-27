import React from 'react';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
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
    subjectsPerExperiment: 1,
    subjectFieldRequirements: [],
    locations: [],
}

export const InhouseSetting = (ps) => {
    var {
        onHide,
        onSubmit,
        isTransmitting,

        studyId,
        variantId,
        settingRecord,
        settingRelated,

        availableSubjectCRTs,
        onSuccessfulUpdate
    } = ps;

    var language = useUILanguage();
    var translate = useUITranslation();

    var settingId, settingState;
    if (settingRecord) {
        ({
            _id: settingId,
            state: settingState,
        } = settingRecord)
    }

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchAvailableCRTs({
            collections: [ 'location' ]
        });
    }, [])

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var availableLocationCRTs = (
        fetched.data.crts
        .filter({ 'reservationType': 'inhouse' })
    );

    var bodyBag = {
        availableSubjectCRTs,
        availableLocationCRTs,
        isTransmitting,
        onHide,
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
}

const FormBody = (ps) => {
    var {
        formik,
        availableSubjectCRTs,
        availableLocationCRTs,
        settingRelated,

        isTransmitting,
        onHide,
    } = ps;

    var { getFieldProps } = formik;
    
    var [ language ] = useUILanguage();
    var translate = useUITranslation();

    var selectedSubjectType = getFieldProps('$.subjectTypeKey').value;
    var selectedSubjectCRT = undefined;
    if (selectedSubjectType) {
        selectedSubjectCRT = availableSubjectCRTs.find({
            type: selectedSubjectType
        });
    }
    
    return (
        <>
            <Fields.GenericEnum { ...({
                dataXPath: '$.subjectTypeKey',
                label: translate('Subject Type'),
                required: true,
                options: availableSubjectCRTs.asOptions({ language })
            })} />
            <Fields.Integer { ...({
                dataXPath: '$.subjectsPerExperiment',
                label: translate('per Appointment'),
                required: true,
                min: 1,
                disabled: !selectedSubjectType
            })} />

            <Fields.SubjectFieldRequirementList { ...({
                dataXPath: '$.subjectFieldRequirements',
                label: translate('Appointment Conditions'),
                subjectCRT: selectedSubjectCRT,
                disabled: !selectedSubjectType
            })} />

            <Fields.TypedLocationIdList { ...({
                dataXPath: '$.locations',
                label: translate('reservable_locations'),
                typeOptions: availableLocationCRTs.asOptions({ language }),
                disabled: !selectedSubjectType,

                related: settingRelated,
            })} />

            <SmallFormFooter extraClassName='pt-2'>
                <AsyncButton type='submit' isTransmitting={ isTransmitting }>
                    { translate('Save') }
                </AsyncButton>
            </SmallFormFooter>
        </>
    );
}
