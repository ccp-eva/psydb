import React from 'react';
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

    return (
        <>
            <ForeignId { ...({
                dataXPath: `${dataXPath}.researchGroupId`,
                label: 'Gruppe',
                required: true,
                collection: 'researchGroup',
                disabled,

                related,
            })} />
            <ForeignId { ...({
                dataXPath: `${dataXPath}.systemRoleId`,
                label: 'Rolle',
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
