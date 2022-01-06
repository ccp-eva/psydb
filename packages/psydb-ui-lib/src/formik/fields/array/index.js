import React from 'react';
import { FormHelpers } from '@mpieva/psydb-ui-layout';
import factory from '../../field-array-factory';
import * as ScalarFields from '../scalar';
import * as ObjectFields from '../object';

const s = {};
for (var k of Object.keys(ScalarFields)) {
    s[`${k}List`] = factory({
        FieldComponent: ScalarFields[k],
        ArrayContentWrapper: FormHelpers.ScalarArrayContentWrapper,
        ArrayItemWrapper: FormHelpers.ScalarArrayItemWrapper,
        defaultItemValue: null,
    });
}

const o = {};
for (var k of Object.keys(ObjectFields)) {
    o[`${k}List`] = factory({ FieldComponent: ObjectFields[k]});
}

const {
    ForeignIdList,
    HelperSetItemIdList,
    GenericEnumList,
    IntegerEnumList,
    SaneStringList,
    DefaultBoolList,
    ExtBoolList,
    BiologicalGenderList,
} = s;

const {
    AgeFrameBoundaryList,
    SubjectFieldRequirementList,
    TypedLocationIdList
} = o;

export {
    ForeignIdList,
    HelperSetItemIdList,
    GenericEnumList,
    IntegerEnumList,
    SaneStringList,
    DefaultBoolList,
    ExtBoolList,
    BiologicalGenderList,

    AgeFrameBoundaryList,
    SubjectFieldRequirementList,
    TypedLocationIdList
}
