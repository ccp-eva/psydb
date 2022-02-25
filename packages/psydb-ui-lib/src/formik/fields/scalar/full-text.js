import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import { withField } from '@cdxoo/formik-utils';

export const FullText = withField({
    Control: (ps) => {
        var { formikField, formikMeta, disabled, rows = 8 } = ps;
        var { error } = formikMeta;
        return (
            <Form.Control
                type='text'
                disabled={ disabled }
                isInvalid={ !!error }
                { ...formikField }
            
                as='textarea'
                rows={ rows }
            />
        )
    }
})
