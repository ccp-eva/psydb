import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import { withField } from '@cdxoo/formik-utils';

export const Color = withField({
    Control: (ps) => {
        var { formikField, formikMeta, disabled } = ps;
        var { error } = formikMeta;
        return (
            <Form.Control
                type='color'
                disabled={ disabled }
                isInvalid={ !!error }
                { ...formikField }
            />
        )
    }
})
