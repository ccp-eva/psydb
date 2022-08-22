import React from 'react';
import { withField, withFieldArray } from '@cdxoo/formik-utils';
import { SubjectTestingPermission } from './subject-testing-permission';



const SubjectTestingPermissionListArray = withFieldArray({
    FieldComponent: SubjectTestingPermission,
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
    defaultItemValue: (ps) => {
        var { permissions } = ps;
        //console.log(ps);
        //var [ primaryResearchGroupId ] = permissions.getResearchGroupIds();
        return ({
            //researchGroupId: primaryResearchGroupId,
            permissionList: (
                [
                    'inhouse',
                    'online-video-call',
                    'away-team',
                    'online-survey'
                ].map(it => ({
                    labProcedureTypeKey: it,
                    value: 'unknown'
                }))
            )
        })
    }
});

export const SubjectTestingPermissionList = withField({
    Control: (ps) => {
        var { formikField } = ps;
        var { value = [] } = formikField;

        var existingResearchGroupIds = (
            value
            .filter(it => it.researchGroupId)
            .map(it => it.researchGroupId)
        )

        return (
            <SubjectTestingPermissionListArray
                { ...ps }
                existingResearchGroupIds={ existingResearchGroupIds }
            />
        )
    },
    DefaultWrapper: 'NoneWrapper',
});
