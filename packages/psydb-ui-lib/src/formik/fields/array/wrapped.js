import React from 'react';
import { FormHelpers } from '@mpieva/psydb-ui-layout';
import factory from '../../field-array-factory';
import { withFieldArray } from '@cdxoo/formik-utils';
import * as ScalarFields from '../scalar';
import * as ObjectFields from '../object';

/*const s = {};
for (var k of Object.keys(ScalarFields)) {
    s[`${k}List`] = factory({
        FieldComponent: ScalarFields[k],
        ArrayContentWrapper: FormHelpers.ScalarArrayContentWrapper,
        ArrayItemWrapper: FormHelpers.ScalarArrayItemWrapper,
        defaultItemValue: null,
    });
}*/

const s = {};
for (var k of Object.keys(ScalarFields)) {
    s[`${k}List`] = withFieldArray({
        FieldComponent: ScalarFields[k],
        ArrayItemWrapper: 'ScalarArrayItemWrapper',
        defaultItemValue: null,
    });
}

const o = {};
for (var k of Object.keys(ObjectFields)) {
    o[`${k}List`] = withFieldArray({
        FieldComponent: ObjectFields[k],
        ArrayContentWrapper: 'ObjectArrayContentWrapper',
        ArrayItemWrapper: 'ObjectArrayItemWrapper',
    });
}

const {
    ForeignIdList,
    HelperSetItemIdList,
    GenericEnumList,
    IntegerEnumList,
    SaneStringList,
    URLStringList,
    DefaultBoolList,
    ExtBoolList,
    BiologicalGenderList,
    EmailList,
    PhoneList,
    LabMethodKeyList,
    LocationTypeKeyList,
} = s;

const {
    AgeFrameBoundaryList,
    SubjectFieldRequirementList,
    TypedLocationIdList,
} = o;

export {
    ForeignIdList,
    HelperSetItemIdList,
    GenericEnumList,
    IntegerEnumList,
    SaneStringList,
    URLStringList,
    DefaultBoolList,
    ExtBoolList,
    BiologicalGenderList,
    EmailList,
    PhoneList,
    LabMethodKeyList,
    LocationTypeKeyList,

    AgeFrameBoundaryList,
    SubjectFieldRequirementList,
    TypedLocationIdList,
}
