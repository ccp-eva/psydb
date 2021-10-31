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
} from './utils';

import { StudyPanel } from './study-panel';

export const SelectionForm = (ps) => {
    var {
        subjectTypeRecord,
        ageFrameRecords,
        ageFrameRelated
    } = ps;

    var grouped = groupBy({
        items: ageFrameRecords,
        byProp: 'studyId',
    });

    var initialValues = createInitialValues({ ageFrameRecords });
    console.log(initialValues);

    var handleSubmit = (formData) => {
        try {
        var { interval, filters } = formData['$'];

        var converted = [];
        var sorted = Object.keys(filters).sort();
        console.log(sorted);
        for (var key of sorted) {
            var value = filters[key];

            var segments = key.split('/');
            var [
                studyId,
                ageFrameKey,
                ...rest
            ] = segments;

            var ageFrameInterval = (
                parseEncodedInterval(ageFrameKey)
            );

            if (segments.length === 2) {
                converted.push({
                    studyId,
                    ageFrameInterval,
                    isEnabled: value,
                });
            }
            else if (segments.length === 4) {
                var [
                    escapedPointer,
                    conditionValue
                ] = rest;

                var pointer = (
                    unescapeJsonPointer(escapedPointer)
                );
                
                converted.push({
                    studyId,
                    ageFrameInterval,
                    pointer,
                    value: conditionValue,
                    isEnabled: value,
                });
            }
        }
        console.log({ converted })
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ handleSubmit }
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


