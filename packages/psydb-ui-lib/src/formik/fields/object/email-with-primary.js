import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { Email, DefaultBool } from '../scalar';

const Control = (ps) => {
    var { 
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        disabled,
    } = ps;

    return (
        <>
            <Email
                label='Email'
                dataXPath={ `${dataXPath}.email` }
                disabled={ disabled }
            />
            <DefaultBool
                label='primäre Adresse'
                dataXPath={ `${dataXPath}.isPrimary` }
                disabled={ disabled }
            />
        </>
    )
}

export const EmailWithPrimary = withField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
