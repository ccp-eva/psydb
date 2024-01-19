import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { SplitPartitioned } from '@mpieva/psydb-ui-layout';

import { ForeignId } from '../scalar';

const Control = (ps) => {
    var { 
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        disabled,
        // TODO: make already selected roles/grops exlcudable
        // (except this item is the one that has it selected)
        excludedResearchGroupIds,
        excludedRoleIds,
        
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
            />
            <ForeignId
                dataXPath={ `${dataXPath}.systemRoleId` }
                label={ translate('System Role') }
                required={ true }
                collection={ 'systemRole' }
                disabled={ disabled }

                formGroupClassName='pl-4 m-0'
                uiSplit={[ 4,8 ]}
                related={ related }
            />
        </SplitPartitioned>
    )
}

export const ResearchGroupWithRole = withField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
