import React from 'react';
import { Form, FormHelpers } from '@mpieva/psydb-ui-layout';
import WithField from '../with-field';

export const Integer = WithField({
    Control: (ps) => {
        var { formikField, disabled, autoFocus } = ps;
        return (
            <Form.Control
                type='number'
                step='1'
                disabled={ disabled }
                autoFocus={ autoFocus }
                { ...formikField }
            />
        )
    },
    DefaultWrapper: FormHelpers.QuickSearchWrapper
})

