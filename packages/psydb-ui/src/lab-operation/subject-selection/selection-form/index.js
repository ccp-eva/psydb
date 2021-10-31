import React from 'react';

import { groupBy } from '@mpieva/psydb-common-lib';
import { Button, Form as BSForm } from '@mpieva/psydb-ui-layout';

import {
    stringifyFieldValue,
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib/';

import {
    unescapeJsonPointer,
    createInitialValues,
    parseEncodedInterval,
} from '../utils';

import { StudyPanel } from './study-panel';

export const SelectionForm = (ps) => {
    var {
        subjectTypeRecord,
        ageFrameRecords,
        ageFrameRelated,

        onSubmit,
    } = ps;

    var grouped = groupBy({
        items: ageFrameRecords,
        byProp: 'studyId',
    });

    var initialValues = createInitialValues({ ageFrameRecords });
    console.log(initialValues);

    /*var handleSubmit = (formData) => {
        try {
            var { interval, filters } = formData['$'];
            var converted = convertFilters(filters);
            console.log({ converted })
        }
        catch (e) {
            console.log(e);
        }
    }*/

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {(formikProps) => (
                <>
                    <header className='pb-1 mb-3 border-bottom'>
                        <b>Zeitraum</b>
                    </header>
                    <Fields.DateOnlyServerSide
                        label='Von'
                        dataXPath='$.interval.start'
                    />
                    <Fields.DateOnlyServerSide
                        label='Bis'
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
                        Suchen
                    </Button>
                </>
            )}
        </DefaultForm>
    );
}

