import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { ForeignId, GenericEnum } from '../scalar';

var accessOptions = {
    'read': 'Lesen',
    'write': 'Schreiben',
}

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
            <GenericEnum
                dataXPath={ `${dataXPath}.permission`}
                label='Berechtigung'
                options={ accessOptions }
                disabled={ disabled }
                required
            />
        </>
    )
}

export const AccessRightByResearchGroup = withField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});
