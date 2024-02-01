import React from 'react';
import { stringifyFieldValue } from '@mpieva/psydb-common-lib';
import { useUILanguage, useUILocale } from '@mpieva/psydb-ui-contexts';

export const AgeFrameCondition = (ps) => {
    var {
        condition,
        ageFrameRecord,
        ageFrameRelated,
        subjectTypeRecord,
        studyData,
    } = ps;
    var { pointer, values } = condition;

    var [ language ] = useUILanguage();
    var locale = useUILocale();

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

                    language,
                    locale,
                })).join(', ') }
            </div>
        </div>
    );
}
