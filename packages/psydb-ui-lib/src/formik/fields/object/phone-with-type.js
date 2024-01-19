import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { SplitPartitioned } from '@mpieva/psydb-ui-layout';

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

    var translate = useUITranslation();

    var fieldOptions = {
        'business': '_phone_type_business',
        'private': '_phone_type_private',
        'mobile': '_phone_type_mobile',
        // FIXME: theese 3 need to be controllable
        // in CRT field props
        ...(enableFaxNumber && {
            'fax': '_phone_type_fax',
        }),
        ...(enableParentNumbers && {
            'mother': '_phone_type_mother',
            'father': '_phone_type_father',
        })
    }

    return (
        <SplitPartitioned partitions={[ 5,3 ]}>
            <SaneString
                label={ translate('_phone_number') }
                dataXPath={ `${dataXPath}.number` }
                disabled={ disabled }
                formGroupClassName='m-0'
                uiSplit={[ 3,9 ]}
            />
            <GenericEnum
                label={ translate('Type') }
                dataXPath={ `${dataXPath}.type` }
                options={ translate.options(fieldOptions) }
                disabled={ disabled }
                formGroupClassName='pl-4 m-0'
                uiSplit={[ 4,8 ]}
            />
        </SplitPartitioned>
    )
}

export const PhoneWithType = withField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
