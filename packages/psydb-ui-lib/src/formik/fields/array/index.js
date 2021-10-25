import React from 'react';
import factory from '../../field-array-factory';
import * as ScalarFields from '../scalar';
import * as ObjectFields from '../object';

const s = {};
for (var k of Object.keys(ScalarFields)) {
    s[`${k}List`] = factory({ FieldComponent: ScalarFields[k]});
}

const o = {};
for (var k of Object.keys(ObjectFields)) {
    o[`${k}List`] = factory({ FieldComponent: ObjectFields[k]});
}

const {
    ForeignIdList,
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
