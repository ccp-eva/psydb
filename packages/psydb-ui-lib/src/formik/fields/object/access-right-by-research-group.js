import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { SplitPartitioned } from '@mpieva/psydb-ui-layout';

import { ForeignId, GenericEnum } from '../scalar';

var accessOptions = {
    'read': 'Read',
    'write': 'Write',
}

const Control = (ps) => {
    var { 
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        disabled,
        existingResearchGroupIds,
        
        related,
    } = ps;

    var translate = useUITranslation();

    return (
        <SplitPartitioned partitions={[ 5,3 ]}>
            <ForeignId
                dataXPath={ `${dataXPath}.researchGroupId` }
                label={ translate('Research Group') }
                required={ true }
                collection='researchGroup'
                disabled={ disabled }
                formGroupClassName='m-0'
                uiSplit={[ 3,9 ]}

                related={ related }
                excludedIds={ existingResearchGroupIds }
            />
            <GenericEnum
                dataXPath={ `${dataXPath}.permission`}
                label={ translate('Permission') }
                options={ translate.options(accessOptions) }
                disabled={ disabled }
                formGroupClassName='pl-4 m-0'
                uiSplit={[ 4,8 ]}
                required
            />
        </SplitPartitioned>
    )
}

export const AccessRightByResearchGroup = withField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
