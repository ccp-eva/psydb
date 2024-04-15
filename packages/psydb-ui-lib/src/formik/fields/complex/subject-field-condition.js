import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { FormHelpers } from '@mpieva/psydb-ui-layout';

import factory from '../../field-array-factory';
import WithField from '../../with-field';
import WithFieldArray from '../../with-field-array';
import * as ScalarFields from '../scalar';

// all the non scalar types
const prohibitedFieldTypes = [
    'FullText',
    'SaneString',

    'Address',
    'ForeignIdList',
    'ForeignId',
    'HelperSetItemIdList',
    'DateSinceBirthInterval',
    //'DateOnlyServerSide',
    'EmailList',
    'PhoneWithTypeList',
    'GeoCoords',
    'TimeInterval',
    'WeekdayBoolObject',
    'Phone',
    'PhoneList',
    'Email',
    'ListOfObjects',

    'Password',
];

const targetFieldTypeComponentMap = {
    ...Object.keys(ScalarFields).reduce((acc, key) => ({
        ...acc, [key]: ScalarFields[key]
    }), {}),

    'ForeignIdList': ScalarFields.ForeignId,
    //'HelperSetItemIdList': HelperSetItemIdField,
}

const ConditionValueField = (ps) => {
    var {
        crt,
        targetField = {},
        ...downstream
    } = ps;

    var { type, props } = targetField;

    var FieldComponent = (
        targetFieldTypeComponentMap[type]
        || ScalarFields.SaneString
    );
    return (
        <FieldComponent { ...downstream } { ...props } />
    );
}

const ConditionValueFieldList = factory({
    FieldComponent: ConditionValueField,
    ArrayContentWrapper: FormHelpers.ScalarArrayContentWrapper,
    ArrayItemWrapper: FormHelpers.ScalarArrayItemWrapper,
    defaultItemValue: null,
});

const Control = (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,
        crt,
        disabled,
    } = ps;

    var translate = useUITranslation();

    var { getFieldProps, values } = formikForm;
    var selectedPointer = (
        getFieldProps(`${dataXPath}.pointer`).value
    );

    var filteredFields = crt.findCustomFields({
        'type': { $nin: prohibitedFieldTypes },
        'props.isSpecialAgeFrameField': { $ne: true },
        'isRemoved': { $ne: true }
    });

    var fieldOptions = {};
    var targetFields = {};
    for (var fieldData of filteredFields) {
        var { pointer, key, type, displayName } = fieldData;
        fieldOptions[pointer] = displayName;
        targetFields[pointer] = fieldData;
    }

    var targetField = targetFields[selectedPointer];

    return (
        <>
            <ScalarFields.GenericEnum { ...({
                dataXPath: `${dataXPath}.pointer`,
                label: translate('Field'),
                required: true,
                options: fieldOptions,
                disabled,
            }) } />

            <ConditionValueFieldList { ...({
                dataXPath: `${dataXPath}.values`,
                label: translate('Values'),
                required: true,
                disabled: disabled || !selectedPointer,
                targetField,
                enableMove: false,
            })} />
        </>
    )
};

export const SubjectFieldCondition = WithField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
