import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import WithField from '../../with-field';

import { withField } from '@cdxoo/formik-utils';

export const SaneString = withField({
    Control: (ps) => {
        var { formikField, formikMeta, disabled } = ps;
        var { error } = formikMeta;
        return (
            <Form.Control
                type='text'
                disabled={ disabled }
                isInvalid={ !!error }
                { ...formikField }
            />
        )
    }
})

