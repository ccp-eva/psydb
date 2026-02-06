import React from 'react';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';

export const AgeFrameCondition = (ps) => {
    var {
        condition,
        ageFrameRelated,
        subjectCRT,
    } = ps;

    var [{ translate, language, locale }] = useI18N();

    var { pointer, values } = condition;
    var [ definition ] = subjectCRT.findCustomFields({
        'pointer': pointer
    });

    // FIXME: this is lab-operation/../selection-settings-form-schema.js
    var realType = definition.systemType;
    // FIXME: maybe we can just cut the "List" suffix via regex
    if (definition.systemType === 'HelperSetItemIdList') {
        realType = 'HelperSetItemId';
    }
    if (definition.systemType === 'ForeignIdList') {
        realType = 'ForeignId';
    }

    // FIXME
    var related = __fixRelated(ageFrameRelated, { isResponse: false });
    
    return (
        <div className='d-flex'>
            <div style={{ width: '20%' }}>
                { translate.fieldDefinition(definition) }:
            </div>
            <div className='flex-grow'>
                { values.map(it => {
                    var stringify = Fields[realType]?.stringifyValue;
                    var out = stringify ? (
                        stringify({
                            value: it, definition, related,
                            i18n: { language, locale }
                        })
                    ) : '[!!ERROR!!]';
                    return out;
                }).join(', ')}
            </div>
        </div>
    );
}
