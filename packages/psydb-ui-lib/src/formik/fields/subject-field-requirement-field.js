import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import WithField from '../with-field';
import { GenericEnumField } from './generic-enum-field';

// all the non scalar types
const prohibitedFieldTypes = [
    'Address',
    'ForeignIdList',
    'HelperSetItemIdList',
    'DateSinceBirthInterval',
    'EmailList',
    'PhoneList',
    'GeoCoords',
    'TimeInterval',
    'WeekdayBoolObject',
    'ListOfObjects',

    'Password',
];

var checkOptions = {
    'inter-subject-equality': 'ist Gleich im Termin'
}


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

    var fieldOptions = (
        subjectScientificFields
        .filter(it => (
            !it.isRemoved &&
            !prohibitedFieldTypes.includes(it.type)
        ))
        .reduce((acc, field) => {
            var { key, displayName } = field;
            var pointer = `/scientific/state/custom/${key}`;
            return { ...acc, [pointer]: displayName };
        }, {})
    );

    return (
        <>
            <GenericEnumField { ...({
                dataXPath: `${dataXPath}.pointer`,
                label: 'Feld',
                required: true,
                options: fieldOptions,
                disabled,
            }) } />
            
            <GenericEnumField { ...({
                dataXPath: `${dataXPath}.check`,
                label: 'Bedingung',
                required: true,
                options: checkOptions,
                disabled: disabled || !selectedPointer
            }) } />
        </>
    )
};

export const SubjectFieldRequirementField = WithField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
