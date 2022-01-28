import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { Form } from '@mpieva/psydb-ui-layout';

export const Integer = withField({
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

