import React from 'react';
import { withFieldArray } from '@cdxoo/formik-utils';
import { SubjectTestingPermission } from './subject-testing-permission';

export const SubjectTestingPermissionList = withFieldArray({
    FieldComponent: SubjectTestingPermission,
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
    defaultItemValue: (ps) => {
        var { permissions } = ps;
        //console.log(ps);
        var [ primaryResearchGroupId ] = permissions.getResearchGroupIds();
        return (
            primaryResearchGroupId
            ? {
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
            }
            : {}
        )
    }
});
