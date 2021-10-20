import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import WithField from '../with-field';

export const SaneStringField = WithField({
    Control: (ps) => {
        var { formikField } = ps;
        return (
            <Form.Control type='text' { ...formikField } />
        )
    }
})

export const IntegerField = WithField({
    type: 'number',
    fakeDefault: Infinity,

    Control: (ps) => {
        var { formikField, min, max, step } = ps;
        return (
            <Form.Control
                type='number'
                min={ min }
                max={ max }
                step={ step }
                { ...formikField }
            />
        )
    },
})

