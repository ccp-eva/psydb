import React from 'react';
import stringifyFieldValue from '@mpieva/psydb-ui-lib/src/stringify-field-value';

export const AgeFrameCondition = ({
    condition,

    ageFrameRecord,
    ageFrameRelated,

    subjectTypeRecord,
    studyData,
}) => {
    var { pointer, values } = condition;

    var fieldDefinition = (
        subjectTypeRecord.state.settings.subChannelFields.scientific
        .find(it => (
            pointer === `/scientific/state/custom/${it.key}`
        ))
    );

    // FIXME: this is lab-operation/../selection-settings-form-schema.js
    var realType = fieldDefinition.type;
    // FIXME: maybe we can just cut the "List" suffix via regex
    if (fieldDefinition.type === 'HelperSetItemIdList') {
        realType = 'HelperSetItemId';
    }
    if (fieldDefinition.type === 'ForeignIdList') {
        realType = 'ForeignId';
    }

    return (
        <div className='d-flex'>
            <div style={{ width: '20%' }}>
                { fieldDefinition.displayName }:
            </div>
            <div className='flex-grow'>
                { values.map(rawValue => stringifyFieldValue({
                    rawValue,
                    fieldDefinition: {
                        ...fieldDefinition,
                        type: realType
                    },
                    ...ageFrameRelated,
                })).join(', ') }
            </div>
        </div>
    );
}
