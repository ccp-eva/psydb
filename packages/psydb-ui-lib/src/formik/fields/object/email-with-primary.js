import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { SplitPartitioned } from '@mpieva/psydb-ui-layout';

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
        <SplitPartitioned partitions={[ 5,3 ]}>
            <Email
                label={ translate('E-Mail') }
                dataXPath={ `${dataXPath}.email` }
                disabled={ disabled }
                formGroupClassName='m-0'
                uiSplit={[ 3,9 ]}
            />
            <DefaultBool
                label={ translate('_email_is_primary') }
                dataXPath={ `${dataXPath}.isPrimary` }
                disabled={ disabled }
                formGroupClassName='pl-4 m-0'
                uiSplit={[ 6,6 ]}
            />
        </SplitPartitioned>
    )
}

export const EmailWithPrimary = withField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
