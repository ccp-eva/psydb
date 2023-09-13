import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

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
        <>
            <ForeignId { ...({
                dataXPath: `${dataXPath}.researchGroupId`,
                label: translate('Research Group'),
                required: true,
                collection: 'researchGroup',
                disabled,

                related,
                excludedIds: existingResearchGroupIds
            })} />
            <GenericEnum
                dataXPath={ `${dataXPath}.permission`}
                label={ translate('Permission') }
                options={ translate.options(accessOptions) }
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
