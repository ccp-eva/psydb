import React from 'react';
import { withField, withFieldArray } from '@cdxoo/formik-utils';
import { intersect } from '@mpieva/psydb-core-utils';
import { useUIConfig } from '@mpieva/psydb-ui-contexts';
import { SubjectTestingPermission } from './subject-testing-permission';



const SubjectTestingPermissionListArray = withFieldArray({
    FieldComponent: SubjectTestingPermission,
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
    defaultItemValue: (ps) => {
        var { enabledLabMethods } = useUIConfig();
        var { permissions } = ps;
        //console.log(ps);
        //var [ primaryResearchGroupId ] = permissions.getResearchGroupIds();

        var availableLabMethods = intersect(enabledLabMethods, [
            'inhouse',
            'online-video-call',
            'away-team',
            'online-survey'
        ]);
        return ({
            //researchGroupId: primaryResearchGroupId,
            permissionList: (
                availableLabMethods.map(it => ({
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
