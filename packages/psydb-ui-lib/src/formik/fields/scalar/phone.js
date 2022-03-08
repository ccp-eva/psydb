import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { Form } from '@mpieva/psydb-ui-layout';

export const Phone = withField({
    Control: (ps) => {
        var { formikField, formikMeta, disabled } = ps;
        var { error } = formikMeta;
        return (
            <Form.Control
                disabled={ disabled }
                isInvalid={ !!error }
                { ...formikField }
            />
        )
    }
})

