import React from 'react';
import { stringifyFieldValue } from '@mpieva/psydb-common-lib';
import {
    useUILanguage, useUILocale, useUITranslation
} from '@mpieva/psydb-ui-contexts';

export const AgeFrameCondition = (ps) => {
    var {
        condition,
        ageFrameRecord,
        ageFrameRelated,
        subjectTypeRecord,
        subjectCRT,
        studyData,
    } = ps;

    var translate = useUITranslation();
    var [ language ] = useUILanguage();
    var locale = useUILocale();

    var { pointer, values } = condition;
    
    var fieldDefinition = subjectCRT.findCustomFields({
        'pointer': pointer
    })[0];

    // FIXME: this is lab-operation/../selection-settings-form-schema.js
    var realType = fieldDefinition.systemType;
    // FIXME: maybe we can just cut the "List" suffix via regex
    if (fieldDefinition.systemType === 'HelperSetItemIdList') {
        realType = 'HelperSetItemId';
    }
    if (fieldDefinition.systemType === 'ForeignIdList') {
        realType = 'ForeignId';
    }

    return (
        <div className='d-flex'>
            <div style={{ width: '20%' }}>
                { translate.fieldDefinition(fieldDefinition) }:
            </div>
            <div className='flex-grow'>
                { values.map(rawValue => stringifyFieldValue({
                    rawValue,
                    fieldDefinition: {
                        ...fieldDefinition,
                        type: realType,
                        systemType: realType,
                    },
                    ...ageFrameRelated,

                    language,
                    locale,
                })).join(', ') }
            </div>
        </div>
    );
}
