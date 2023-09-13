import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import { Email, DefaultBool } from '../scalar';

const Control = (ps) => {
    var { 
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        disabled,
    } = ps;

    var translate = useUITranslation();

    return (
        <>
            <Email
                label={ translate('E-Mail') }
                dataXPath={ `${dataXPath}.email` }
                disabled={ disabled }
            />
            <DefaultBool
                label={ translate('_email_is_primary') }
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
