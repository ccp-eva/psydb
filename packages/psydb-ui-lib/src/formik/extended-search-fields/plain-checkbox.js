import React from 'react';
import { Form, FormHelpers } from '@mpieva/psydb-ui-layout';
import WithField from '../with-field';

export const PlainCheckbox = WithField({
    Control: (ps) => {
        var { formikField, disabled, label } = ps;
        return (
            <Form.Check
                label={ label }
                disabled={ disabled }
                { ...formikField }
            />
        )
    },
    type: 'checkbox',
    fakeDefault: false,
    DefaultWrapper: FormHelpers.NoneWrapper
})

