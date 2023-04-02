import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import * as Controls from '@mpieva/psydb-ui-form-controls';

export const SaneString = withField({
    Control: (ps) => {
        var {
            dataXPath,
            formikField,
            formikMeta,
            formikForm,

            extraOnChange,
            ...pass
        } = ps;

        var { error } = formikMeta;
        var { setFieldValue } = formikForm;
        var { value } = formikField;

        return (
            <Controls.SaneString
                type='text'
                value={ value }
                isInvalid={ !!error }
                onChange={ (ev) => {
                    var next = ev.target.value;
                    extraOnChange && extraOnChange(next);
                    setFieldValue(dataXPath, next)
                }}
                { ...pass }
            />
        )
    }
})

