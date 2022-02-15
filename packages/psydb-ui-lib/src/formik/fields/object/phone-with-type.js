import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { SaneString, GenericEnum } from '../scalar';

const Control = (ps) => {
    var { 
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        disabled,
        enableFaxNumber,
        enableParentNumbers,
    } = ps;

    var fieldOptions = {
        'business': 'geschäftlich',
        'private': 'privat',
        'mobile': 'mobil',
        // FIXME: theese 3 need to be controllable
        // in CRT field props
        ...(enableFaxNumber && {
            'fax': 'Fax',
        }),
        ...(enableParentNumbers && {
            'mother': 'Tel. Mutter',
            'father': 'Tel. Vater',
        })
    }

    return (
        <>
            <SaneString
                label='Nummer'
                dataXPath={ `${dataXPath}.number` }
                disabled={ disabled }
            />
            <GenericEnum
                label='Typ'
                dataXPath={ `${dataXPath}.type` }
                options={ fieldOptions }
                disabled={ disabled }
            />
        </>
    )
}

export const PhoneWithType = withField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
