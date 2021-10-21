import React from 'react';
import {
    TypedLocationIdField
} from './typed-location-id-field';

import WithFieldArray from '../with-field-array';

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

export const TypedLocationIdListField = factory({
    FieldComponent: TypedLocationIdField
});
