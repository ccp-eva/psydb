import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import WithField from '../../with-field';
import {
    GenericEnum,
    ForeignId,
} from '../scalar'

const Control = (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,
        
        typeOptions,
        disabled,

        related,
    } = ps;

    var { getFieldProps } = formikForm;
    var selectedType = (
        getFieldProps(`${dataXPath}.customRecordTypeKey`).value
    );

    var translate = useUITranslation();
    //console.log({ related });

    return (
        <>
            <GenericEnum { ...({
                dataXPath: `${dataXPath}.customRecordTypeKey`,
                label: translate('Type'),
                required: true,
                options: typeOptions,
                disabled,
            }) } />
            <ForeignId { ...({
                dataXPath: `${dataXPath}.locationId`,
                label: translate('Location'),
                required: true,
                collection: 'location',
                recordType: selectedType,
                disabled: disabled || !selectedType,

                related,
            })} />
        </>
    )
}

export const TypedLocationId = WithField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
