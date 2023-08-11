import React from 'react';
import { Form, FormHelpers } from '@mpieva/psydb-ui-layout';
import WithField from '../with-field';

export const SaneString = WithField({
    Control: (ps) => {
        var { formikField, disabled, autoFocus } = ps;
        return (
            <Form.Control
                type='text'
                disabled={ disabled }
                autoFocus={ autoFocus }
                { ...formikField }
            />
        )
    },
    DefaultWrapper: FormHelpers.QuickSearchWrapper
})

