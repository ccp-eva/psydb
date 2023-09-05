import React from 'react';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';

import { groupBy } from '@mpieva/psydb-common-lib';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    stringifyFieldValue,
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib';

import { createInitialValues } from '../utils';

import { StudyPanel } from './study-panel';

export const SelectionForm = (ps) => {
    var {
        subjectTypeRecord,
        ageFrameRecords,
        ageFrameRelated,

        onSubmit,
    } = ps;

    var locale = useUILocale();
    var translate = useUITranslation();

    var grouped = groupBy({
        items: ageFrameRecords,
        byProp: 'studyId',
    });

    var initialValues = createInitialValues({ ageFrameRecords, locale });

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {(formikProps) => (
                <>
                    <header className='pb-1 mb-3 border-bottom'>
                        <b>{ translate('Appointment Time Range') }</b>
                    </header>
                    <Fields.DateOnlyServerSide
                        label={ translate('Start') }
                        dataXPath='$.interval.start'
                    />
                    <Fields.DateOnlyServerSide
                        label={ translate('End') }
                        dataXPath='$.interval.end'
                    />
                    { Object.keys(grouped).map((key) => (
                        <StudyPanel key={ key } { ...({
                            studyId: key,
                            subjectTypeRecord,
                            ageFrameRecords: grouped[key],
                            ageFrameRelated
                        })} />
                    ))}
                    <hr />
                    <Button type='submit'>
                        { translate('Search') }
                    </Button>
                </>
            )}
        </DefaultForm>
    );
}

