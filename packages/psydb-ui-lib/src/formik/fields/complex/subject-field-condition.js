import React from 'react';
import { FormHelpers } from '@mpieva/psydb-ui-layout';
import factory from '../../field-array-factory';
import WithField from '../../with-field';
import WithFieldArray from '../../with-field-array';
import * as ScalarFields from '../scalar';

// all the non scalar types
const prohibitedFieldTypes = [
    'Address',
    'ForeignIdList',
    'HelperSetItemIdList',
    'DateSinceBirthInterval',
    'DateOnlyServerSide',
    'EmailList',
    'PhoneWithTypeList',
    'GeoCoords',
    'TimeInterval',
    'WeekdayBoolObject',
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
        subjectScientificFields,
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
});

const Control = (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,
        subjectScientificFields,
        disabled,
    } = ps;

    var { getFieldProps } = formikForm;
    var selectedPointer = (
        getFieldProps(`${dataXPath}.pointer`).value
    );

    var filteredFields = (
        subjectScientificFields
        .filter(it => (
            !it.isRemoved &&
            !prohibitedFieldTypes.includes(it.type)
        ))
    );

    var fieldOptions = {},
        targetFields = {};
    for (var fieldData of filteredFields) {
        var { key, type, displayName } = fieldData;
        var pointer = `/scientific/state/custom/${key}`;
        fieldOptions[pointer] = displayName;
        targetFields[pointer] = fieldData;
    }

    var targetField = targetFields[selectedPointer];

    return (
        <>
            <ScalarFields.GenericEnum { ...({
                dataXPath: `${dataXPath}.pointer`,
                label: 'Feld',
                required: true,
                options: fieldOptions,
                disabled,
            }) } />

            <ConditionValueFieldList { ...({
                dataXPath: `${dataXPath}.values`,
                label: 'Werte',
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
