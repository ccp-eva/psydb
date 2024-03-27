import React from 'react';
import { subjectFieldRequirementChecks } from '@mpieva/psydb-schema-enums';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import WithField from '../../with-field';
import { GenericEnum } from '../scalar';

// all the non scalar types
const prohibitedFieldTypes = [
    'SaneString',
    'FullText',
    'DateOnlyServerSide',

    'Address',
    'ForeignIdList',
    'HelperSetItemIdList',
    'DateSinceBirthInterval',
    'EmailList',
    'PhoneWithTypeList',
    'GeoCoords',
    'TimeInterval',
    'WeekdayBoolObject',
    'ListOfObjects',

    'Password',
];

var checkOptions = subjectFieldRequirementChecks.mapping;

const Control = (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,
        subjectCRT,
        disabled,
    } = ps;

    var translate = useUITranslation();

    var { getFieldProps } = formikForm;
    var selectedPointer = (
        getFieldProps(`${dataXPath}.pointer`).value
    );

    var fieldOptions = {};
    if (subjectCRT) {
        var defs = subjectCRT.findCustomFields({
            'isRemoved': { $ne: true },
            'systemType': { $nin: prohibitedFieldTypes },
        })
        for (var it of defs) {
            fieldOptions[it.pointer] = translate.fieldDefinition(it);
        }
    }

    return (
        <>
            <GenericEnum { ...({
                dataXPath: `${dataXPath}.pointer`,
                label: translate('Field'),
                required: true,
                options: fieldOptions,
                disabled,
            }) } />
            
            <GenericEnum { ...({
                dataXPath: `${dataXPath}.check`,
                label: translate('Condition'),
                required: true,
                options: translate.options(checkOptions),
                disabled: disabled || !selectedPointer
            }) } />
        </>
    )
};

export const SubjectFieldRequirement = WithField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
