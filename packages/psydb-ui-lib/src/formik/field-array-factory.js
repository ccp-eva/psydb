import React from 'react';
import WithFieldArray from './with-field-array';

const FieldArrayFactory = ({
    FieldComponent,
    ...otherOptions
}) => WithFieldArray({
    Control: (ps) => {
        var {
            formikField,
            formikMeta,
            formikForm,
            formikArrayHelpers,
            ...downstream
        } = ps;

        return  <FieldComponent { ...downstream } />
    },
    ...otherOptions
})

export default FieldArrayFactory;
