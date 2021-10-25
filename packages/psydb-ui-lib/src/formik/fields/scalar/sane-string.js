import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import WithField from '../../with-field';

export const SaneString = WithField({
    Control: (ps) => {
        var { formikField, disabled } = ps;
        return (
            <Form.Control
                type='text'
                disabled={ disabled }
                { ...formikField }
            />
        )
    }
})

