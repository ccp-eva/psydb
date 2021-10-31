import React from 'react';

import {
    stringifyFieldValue,
    Fields
} from '@mpieva/psydb-ui-lib/';

import {
    escapeJsonPointer,
    createAgeFrameKey,
} from './utils';

export const StudyPanel = (ps) => {
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
