import React from 'react';
import stringifyFieldValue from '@mpieva/psydb-ui-lib/src/stringify-field-value';

const ConditionsByAgeFrame = ({
    conditionsByAgeFrame, 
                
    subjectTypeData,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
}) => {
    return (
        <>
            { conditionsByAgeFrame.map((it, index) => (
                <AgeFrameContainer { ...({
                    key: index,
                    ...it,
                    
                    subjectTypeData,
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,
                }) } />
            ))}
        </>
    );
}

const AgeFrameContainer = ({
    ageFrame,
    conditions,

    subjectTypeData,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
}) => {
    var stringifiedAgeFrame = stringifyFieldValue({
        rawValue: ageFrame,
        fieldDefinition: { type: 'AgeFrame' }
    });

    return (
        <div>
            <div>
                { stringifiedAgeFrame }
            </div>
            { conditions.map((it, index) => (
                <Condition { ...({
                    key: index,
                    ...it,
                    
                    subjectTypeData,
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,
                }) } />
            ))}
        </div>
    );
}

const Condition = ({
    fieldKey,
    values,

    subjectTypeData,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
}) => {
    
    var fieldDefinition = (
        subjectTypeData.state.settings.subChannelFields.scientific
        .find(it => it.key === fieldKey )
    );

    var realType = fieldDefinition.type;
    // FIXME: maybe we can just cut the "List" suffix via regex
    if (fieldDefinition.type === 'HelperSetItemIdList') {
        realType = 'HelperSetItemId';
    }
    if (fieldDefinition.type === 'ForeignIdList') {
        realType = 'ForeignId';
    }

    return (
        <div>
            { fieldDefinition.displayName }
            {' '}
            { values.map(rawValue => stringifyFieldValue({
                rawValue,
                fieldDefinition: {
                    ...fieldDefinition,
                    type: realType
                },
                
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
            }))}
        </div>
    );
}

export default ConditionsByAgeFrame;
