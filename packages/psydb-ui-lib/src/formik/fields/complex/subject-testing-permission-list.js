import React from 'react';
import { withFieldArray } from '@cdxoo/formik-utils';
import { SubjectTestingPermission } from './subject-testing-permission';

export const SubjectTestingPermissionList = withFieldArray({
    FieldComponent: SubjectTestingPermission,
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
});
