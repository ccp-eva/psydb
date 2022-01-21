import React from 'react';
import { Form, FormHelpers } from '@mpieva/psydb-ui-layout';
import { withField } from '@cdxoo/formik-utils';

export const PlainCheckbox = withField({
    Control: (ps) => {
        var { dataXPath, formikField, disabled, label } = ps;
        return (
            <Form.Check
                id={ dataXPath }
                label={ label }
                disabled={ disabled }
                { ...formikField }
            />
        )
    },
    type: 'checkbox',
    fakeDefault: false,
    DefaultWrapper: 'NoneWrapper'
})

