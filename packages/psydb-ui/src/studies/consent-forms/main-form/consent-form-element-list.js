import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields, withField, withFieldArray } from '@mpieva/psydb-ui-lib';
import * as Variants from './consent-form-element-variants';

const ConsentFormElement = withField({ Control: (ps) => {
    var { subjectCRT, dataXPath, formikForm } = ps;
    var { getFieldProps } = formikForm;
    var [{ translate }] = useI18N();

    var selectedType = getFieldProps(`${dataXPath}.type`).value;
    var ElementVariant = switchElementVariant(selectedType);

    return (
        <div>
            <Fields.GenericEnum
                dataXPath={ `${dataXPath}.type` }
                label={ translate('Type') }
                required={ true }
                options={{
                    'info-text-markdown': translate('info-text-markdown'),
                    'subject-field': translate('subject-field'),
                    'extra-field': translate('extra-field'),
                    'hr': translate('hr'),
                }}
            />
            <hr />
            { ElementVariant ? (
                <ElementVariant subjectCRT={ subjectCRT } />
            ) : (
                <i className='text-muted'>
                    { translate('Please select an element type.') }
                </i>
            ) }
        </div>
    )
}});

const switchElementVariant = (subjectType) => {
    switch (subjectType) {
        case 'info-text-markdown':
            return Variants.InfoTextMarkdown;
        case 'subject-field':
            return Variants.SubjectField;
        case 'extra-field':
            return Variants.ExtraField;
        case 'hr':
            return Variants.HR;
    }
}

const ConsentFormElementList = withFieldArray({
    FieldComponent: ConsentFormElement,
    ArrayFieldWrapper: 'FieldWrapperMultiline',
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
    defaultValue: (ps) => ({})
});

export default ConsentFormElementList;
