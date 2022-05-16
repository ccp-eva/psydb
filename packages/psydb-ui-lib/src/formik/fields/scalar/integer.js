import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { Form } from '@mpieva/psydb-ui-layout';

export const Integer = withField({
    type: 'number',
    fakeDefault: null,

    Control: (ps) => {
        var {
            formikField,
            formikMeta,
            formikForm,
            dataXPath,
            isNullable,
            disabled,
            min, max, step,
        } = ps;

        var { error } = formikMeta;

        var { value, onChange } = formikField;
        var { setFieldValue } = formikForm;

        var handleChange = (event) => {
            var { target: { value }} = event;
            if (isNullable && value === '') {
                setFieldValue(dataXPath, null);
            }
            else {
                return onChange(event)
            }
        }
        return (
            <Form.Control
                type='number'
                disabled={ disabled }
                min={ min }
                max={ max }
                step={ step }
                isInvalid={ !!error }
                { ...formikField }
                onChange={ handleChange }
            />
        )
    },
})

