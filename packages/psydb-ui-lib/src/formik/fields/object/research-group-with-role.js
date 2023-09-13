import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { withField } from '@cdxoo/formik-utils';

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
        <>
            <ForeignId { ...({
                dataXPath: `${dataXPath}.researchGroupId`,
                label: translate('Research Group'),
                required: true,
                collection: 'researchGroup',
                disabled,

                related,
            })} />
            <ForeignId { ...({
                dataXPath: `${dataXPath}.systemRoleId`,
                label: translate('System Role'),
                required: true,
                collection: 'systemRole',
                disabled,

                related,
            })} />
        </>
    )
}

export const ResearchGroupWithRole = withField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
