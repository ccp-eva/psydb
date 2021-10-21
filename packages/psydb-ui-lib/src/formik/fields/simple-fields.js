import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import WithField from '../with-field';

export const SaneStringField = WithField({
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

export const IntegerField = WithField({
    type: 'number',
    fakeDefault: Infinity,

    Control: (ps) => {
        var { formikField, disabled, min, max, step } = ps;
        return (
            <Form.Control
                type='number'
                disabled={ disabled }
                min={ min }
                max={ max }
                step={ step }
                { ...formikField }
            />
        )
    },
})

