import React from 'react';
import { withField, withFieldArray } from '@cdxoo/formik-utils';
import { AccessRightByResearchGroup } from '../object';

const AccessRightByResearchGroupListArray = withFieldArray({
    FieldComponent: AccessRightByResearchGroup,
    //ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
    defaultItemValue: { permission: 'write' }
})

export const AccessRightByResearchGroupList = withField({
    Control: (ps) => {
        var { formikField } = ps;
        var { value = [] } = formikField;

        var existingResearchGroupIds = (
            value
            .filter(it => it.researchGroupId)
            .map(it => it.researchGroupId)
        )

        return (
            <AccessRightByResearchGroupListArray
                { ...ps }
                existingResearchGroupIds={ existingResearchGroupIds }
                enableMove={ false }
            />
        )
    },
    DefaultWrapper: 'NoneWrapper',
});
