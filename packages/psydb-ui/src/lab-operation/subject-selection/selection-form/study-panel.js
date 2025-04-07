import React from 'react';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Alert } from '@mpieva/psydb-ui-layout';
import { Fields as FormFields } from '@mpieva/psydb-ui-lib';

import {
    escapeJsonPointer,
    createAgeFrameKey,
} from '../utils';

export const StudyPanel = (ps) => {
    var {
        studyId,
        shorthand,
        subjectCRT,
        ageFrameRecords = [],
        ageFrameRelated
    } = ps;
   
    var [{ translate }] = useI18N();

    return (
        <div>
            <header className='pb-1 mb-3 border-bottom'>
                <b>{ translate('Study') } - { shorthand }</b>
            </header>
            { ageFrameRecords.length > 0 ? (
                ageFrameRecords.map((it, index) => (
                    <AgeFrame key={ index } { ...({
                        subjectCRT,
                        ageFrameRecord: it,
                        ageFrameRelated,
                    })} />
                ))
            ) : (
                <i className='text-muted ml-3'>
                    { translate('No age frames were defined for this study.')}
                </i>
            )}
        </div>
    )
}

const AgeFrame = (ps) => {
    var {
        subjectCRT,
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

    var [{ translate }] = useI18N();
    var formKey = createAgeFrameKey(ageFrameRecord);

    var stringifiedAgeFrame = Fields.AgeFrameInterval.stringifyValue({
        value: interval
    });

    var title = `${translate('Age Range')}  ${stringifiedAgeFrame}`;

    return (
        <div className='p-3 mb-3 border bg-white'>
            <header className='pb-1 mb-3 border-bottom'>
                <FormFields.PlainCheckbox
                    dataXPath={ `$.filters.${formKey}` }
                    label={ title }
                />
            </header>
            { conditions.length > 0 ? (
                conditions.map((it, index) => (
                    <Condition key={ index } { ...({
                        formKey,
                        subjectCRT,
                        condition: it,
                        ageFrameRelated,
                    })} />
                ))
            ) : (
                <i className='text-muted ml-3'>
                    { translate('No further Conditions')}
                </i>
            )}
        </div>
    )
}

const Condition = (ps) => {
    var {
        formKey,
        condition,
        ageFrameRelated,
        subjectCRT,
    } = ps;
    
    var [{ translate, language, locale }] = useI18N();

    var { pointer, values } = condition;
    var [ definition ] = subjectCRT.findCustomFields({
        'pointer': pointer
    });

    var condKey = escapeJsonPointer(pointer);
    formKey = `${formKey}/${condKey}`;

    // FIXME: maybe we can just cut the "List" suffix via regex
    if (definition.systemType === 'HelperSetItemIdList') {
        definition.systemType = 'HelperSetItemId';
    }
    if (definition.systemType === 'ForeignIdList') {
        definition.systemType = 'ForeignId';
    }

    // FIXME
    var related = __fixRelated(ageFrameRelated, { isResponse: false });
    
    return (
        <div className='d-flex'>
            <div style={{ width: '20%' }}>
                { translate.fieldDefinition(definition) }:
            </div>
            <div className='flex-grow'>
                { values.map((value, index) => (
                    <ConditionValue key={ index } { ...({
                        formKey, value, definition, related
                    })} />
                ))}
            </div>
        </div>
    )
}

const ConditionValue = (ps) => {
    var { formKey, value, definition, related } = ps;
    var { systemType } = definition;
    var [{ language, locale }] = useI18N();

    // FIXME: maybe escape certain values?
    formKey = `${formKey}/${value}`;

    var stringify = Fields[systemType]?.stringifyValue;
    var label = stringify ? (
        stringify({
            value, definition, related,
            i18n: { language, locale }
        })
    ) : '[!!ERROR!!]';

    return (
        <FormFields.PlainCheckbox
            dataXPath={ `$.filters.${formKey}` }
            label={ label }
        />
    )
}
