import React from 'react';
import WithFieldArray from '../../with-field-array';
import * as ScalarFields from '../scalar';
import * as ObjectFields from '../object';

const factory = ({ FieldComponent }) => WithFieldArray({
    Control: (ps) => {
        var {
            formikField,
            formikMeta,
            formikForm,
            formikArrayHelpers,
            ...downstream
        } = ps;

        return  <FieldComponent { ...downstream } />
    }
})

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
    DefaultBool,
    ExtBool,
    BiologicalGender,
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
    DefaultBool,
    ExtBool,
    BiologicalGender,

    AgeFrameBoundaryList,
    SubjectFieldRequirementList,
    TypedLocationIdList
}
