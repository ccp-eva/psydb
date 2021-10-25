import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import WithField from '../../with-field';

export const Integer = WithField({
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

