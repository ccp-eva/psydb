import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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
    interval: { 
        start: { years: 0, months: 0, days: 0 },
        end: { years: 0, months: 0, days: 0 },
    },
    conditions: [],
}

export const AgeFrameForm = (ps) => {
    var {
        onHide,
        onSubmit,
        isTransmitting,

        subjectCRT,
        ageFrameRecord,
        ageFrameRelated,
    } = ps;

    var ageFrameId, ageFrameState;
    if (ageFrameRecord) {
        ({ _id: ageFrameId, state: ageFrameState } = ageFrameRecord)
    }

    var translate = useUITranslation();

    var bodyBag = {
        subjectCRT,
        isTransmitting,
        onHide
    }

    return (
        <div>
            <DefaultForm
                onSubmit={ onSubmit }
                initialValues={ ageFrameState || defaultValues }
                useAjvAsync
            >
                {(formik) => (
                    <FormBody formik={ formik } { ...bodyBag } />
                )}
            </DefaultForm>
        </div>
    )
};

const FormBody = (ps) => {
    var { formik, subjectCRT, isTransmitting } = ps;
    
    var translate = useUITranslation();

    return (
        <>
            <Fields.AgeFrameBoundary
                label={ translate('Start') }
                dataXPath='$.interval.start'
            />
            <Fields.AgeFrameBoundary
                label={ translate('End') }
                dataXPath='$.interval.end'
            />
            
            <div className='pl-3'>
                <header className='border-bottom pb-1 mb-2'>
                    <b>{ translate('Conditions') }</b>
                </header>
                <Fields.SubjectFieldConditionList { ...({
                    dataXPath: '$.conditions',
                    crt: subjectCRT,
                    noWrapper: true
                })} />
            </div>

            <SmallFormFooter extraClassName='pt-2'>
                <AsyncButton type='submit' isTransmitting={ isTransmitting }>
                    { translate('Save') }
                </AsyncButton>
            </SmallFormFooter>
        </>
    )
}
