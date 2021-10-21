import React from 'react';
import WithField from '../with-field';
import { GenericEnumField } from './generic-enum-field';
import { ForeignIdField } from './foreign-id-field';

const Control = (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,
        
        typeOptions,
        disabled,
    } = ps;

    var { getFieldProps } = formikForm;
    var selectedType = (
        getFieldProps(`${dataXPath}.customRecordTypeKey`).value
    );

    return (
        <>
            <GenericEnumField { ...({
                dataXPath: `${dataXPath}.customRecordTypeKey`,
                label: 'Typ',
                required: true,
                options: typeOptions,
                disabled,
            }) } />
            <ForeignIdField { ...({
                dataXPath: `${dataXPath}.locationId`,
                label: 'Location',
                required: true,
                collection: 'location',
                recordType: selectedType,
                disabled: disabled || !selectedType
            })} />
        </>
    )
}

export const TypedLocationIdField = WithField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
