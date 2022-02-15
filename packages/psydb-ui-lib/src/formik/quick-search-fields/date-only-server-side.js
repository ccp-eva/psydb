import React from 'react';
import { Form, FormHelpers } from '@mpieva/psydb-ui-layout';
import WithField from '../with-field';

export const DateOnlyServerSide = WithField({
    Control: (ps) => {
        var { formikField, disabled } = ps;
        return (
            <Form.Control
                type='text'
                disabled={ disabled }
                { ...formikField }
            />
        )
    },
    DefaultWrapper: FormHelpers.QuickSearchWrapper
})

