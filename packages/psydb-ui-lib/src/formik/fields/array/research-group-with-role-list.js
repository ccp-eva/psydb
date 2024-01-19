import React from 'react';
import { withField, withFieldArray } from '@cdxoo/formik-utils';
import { ResearchGroupWithRole } from '../object';

const ResearchGroupWithRoleListArray = withFieldArray({
    FieldComponent: ResearchGroupWithRole,
    //ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
})

export const ResearchGroupWithRoleList = withField({
    Control: (ps) => {
        var { formikField } = ps;
        var { value = [] } = formikField;

        var existingResearchGroupIds = (
            value
            .filter(it => it.researchGroupId)
            .map(it => it.researchGroupId)
        )

        return (
            <ResearchGroupWithRoleListArray
                { ...ps }
                existingResearchGroupIds={ existingResearchGroupIds }
                enableMove={ false }
            />
        )
    },
    DefaultWrapper: 'NoneWrapper',
});
