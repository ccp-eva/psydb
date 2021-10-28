import React from 'react';

import { groupBy } from '@mpieva/psydb-common-lib';
import { Form as BSForm } from '@mpieva/psydb-ui-layout';

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

    return (
        <DefaultForm initialValues={ initialValues }>
            {(formikProps) => (
                <>
                    { Object.keys(grouped).map((key) => (
                        <StudyPanel key={ key } { ...({
                            studyId: key,
                            subjectTypeRecord,
                            ageFrameRecords: grouped[key],
                            ageFrameRelated
                        })} />
                    ))}
                </>
            )}
        </DefaultForm>
    );
}

const createAgeFrameKey = ({ interval }) => {
    var create = (af) => {
        var { years, months, days } = af;
        return `${years}-${months}-${days}`;
    }

    var start = create(interval.start);
    var end = create(interval.end);

    return `${start}_${end}`;
}

const escapeJsonPointer = (pointer) => (
    pointer.replaceAll(/\//g, '~1')
);

const createInitialValues = ({
    ageFrameRecords
}) => {
    var initialValues = {};
    for (var ageFrame of ageFrameRecords) {
        var { interval, conditions } = ageFrame.state;
        var afKey = createAgeFrameKey({ interval });

        for (var cond of conditions) {
            var { pointer, values } = cond;
            var condKey = escapeJsonPointer(pointer);
            
            for (var value of values) {
                var fullKey = `${afKey}/${condKey}/${value}`;
                initialValues[fullKey] = true;
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
        interval,
        conditions
    } = ageFrameRecord.state;

    var stringifiedAgeFrame = stringifyFieldValue({
        rawValue: interval,
        fieldDefinition: { type: 'AgeFrameInterval' }
    });

    var title = `Altersfenster  ${stringifiedAgeFrame}`;

    return (
        <div className='p-3 mb-3 border bg-white'>
            <header className='pb-1 mb-3 border-bottom'>
                <BSForm.Check label={ title } />
            </header>
            { conditions.map((it, index) => (
                <Condition key={ index } { ...({
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
        condition,
        ageFrameRelated,
        subjectTypeRecord,
    } = ps;

    var { pointer, values } = condition;

    var fieldDefinition = (
        subjectTypeRecord.state.settings.subChannelFields.scientific
        .find(it => pointer === it.pointer)
    );

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
        value,
        fieldDefinition,
        ageFrameRelated,
    } = ps;

    var label = stringifyFieldValue({
        rawValue: value,
        fieldDefinition,
        ...ageFrameRelated,
    });

    return (
        <BSForm.Check label={ label } />
    );
}
