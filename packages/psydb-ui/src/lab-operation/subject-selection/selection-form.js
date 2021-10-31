import React from 'react';

import { groupBy } from '@mpieva/psydb-common-lib';
import { Button, Form as BSForm } from '@mpieva/psydb-ui-layout';

import {
    stringifyFieldValue,
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib/';

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

    var handleSubmit = (...args) => {
        console.log({ args });
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

const createAgeFrameKey = ({ studyId, interval }) => {
    var create = (af) => {
        var { years, months, days } = af;
        return `${years}-${months}-${days}`;
    }

    var start = create(interval.start);
    var end = create(interval.end);

    return `${studyId}/${start}_${end}`;
}

const escapeJsonPointer = (pointer) => (
    pointer.replaceAll(/\//g, '~1')
);

const createInitialValues = ({
    ageFrameRecords
}) => {
    var now = new Date();
    var initialValues = {
        interval: {
            start: now.toISOString(),
            //end: now.toISOString()
        },
        filters: {}
    };
    for (var ageFrame of ageFrameRecords) {
        var { studyId, state } = ageFrame;
        var { interval, conditions } = state;
        var afKey = createAgeFrameKey({ studyId, interval });
        initialValues.filters[afKey] = true;

        for (var cond of conditions) {
            var { pointer, values } = cond;
            var condKey = escapeJsonPointer(pointer);
            
            for (var value of values) {
                // FIXME: maybe escape certain values?
                var fullKey = `${afKey}/${condKey}/${value}`;
                initialValues.filters[fullKey] = true;
            }
        }
    }
    return initialValues;
}

const StudyPanel = (ps) => {
    var {
        studyId,
        subjectTypeRecord,
        ageFrameRecords,
        ageFrameRelated
    } = ps;

    var { relatedRecordLabels } = ageFrameRelated;
    var title = relatedRecordLabels.study[studyId]._recordLabel;

    return (
        <div>
            <header className='pb-1 mb-3 border-bottom'>
                <b>Studie - { title }</b>
            </header>
            { ageFrameRecords.map((it, index) => (
                <AgeFrame key={ index } { ...({
                    subjectTypeRecord,
                    ageFrameRecord: it,
                    ageFrameRelated,
                })} />
            ))}
        </div>
    )
}

const AgeFrame = (ps) => {
    var {
        subjectTypeRecord,
        ageFrameRecord,
        ageFrameRelated,
    } = ps;

    var {
        studyId,
        state
    } = ageFrameRecord;

    var {
        interval,
        conditions
    } = state;

    var formKey = createAgeFrameKey({ studyId, interval });

    var stringifiedAgeFrame = stringifyFieldValue({
        rawValue: interval,
        fieldDefinition: { type: 'AgeFrameInterval' }
    });

    var title = `Altersfenster  ${stringifiedAgeFrame}`;

    return (
        <div className='p-3 mb-3 border bg-white'>
            <header className='pb-1 mb-3 border-bottom'>
                <Fields.PlainCheckbox
                    dataXPath={ `$.filters.${formKey}` }
                    label={ title }
                />
            </header>
            { conditions.map((it, index) => (
                <Condition key={ index } { ...({
                    formKey,
                    subjectTypeRecord,
                    condition: it,
                    ageFrameRelated,
                })} />
            ))}
        </div>
    )
}

const Condition = (ps) => {
    var {
        formKey,
        condition,
        ageFrameRelated,
        subjectTypeRecord,
    } = ps;

    var { pointer, values } = condition;

    var fieldDefinition = (
        subjectTypeRecord.state.settings.subChannelFields.scientific
        .find(it => pointer === it.pointer)
    );

    var condKey = escapeJsonPointer(pointer);
    formKey = `${formKey}/${condKey}`;

    // FIXME: maybe we can just cut the "List" suffix via regex
    if (fieldDefinition.type === 'HelperSetItemIdList') {
        fieldDefinition.type = 'HelperSetItemId';
    }
    if (fieldDefinition.type === 'ForeignIdList') {
        fieldDefinition.type = 'ForeignId';
    }

    return (
        <div className='d-flex'>
            <div style={{ width: '20%' }}>
                { fieldDefinition.displayName }:
            </div>
            <div className='flex-grow'>
                { values.map((value, index) => (
                    <ConditionValue key={ index } { ...({
                        formKey,
                        value,
                        fieldDefinition,
                        ageFrameRelated,
                    })} />
                ))}
            </div>
        </div>
    )
}

const ConditionValue = (ps) => {
    var {
        formKey,
        value,
        fieldDefinition,
        ageFrameRelated,
    } = ps;

    // FIXME: maybe escape certain values?
    formKey = `${formKey}/${value}`;

    var label = stringifyFieldValue({
        rawValue: value,
        fieldDefinition,
        ...ageFrameRelated,
    });

    return (
        <Fields.PlainCheckbox
            dataXPath={ `$.filters.${formKey}` }
            label={ label }
        />
    )
}
