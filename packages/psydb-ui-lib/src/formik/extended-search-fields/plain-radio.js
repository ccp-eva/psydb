import React from 'react';
import { Form, FormHelpers } from '@mpieva/psydb-ui-layout';
import { withField } from '@cdxoo/formik-utils';

export const PlainRadio = withField({
    Control: (ps) => {
        var { dataXPath, formikField, disabled, label } = ps;
        console.log(ps);
        return (
            <Form.Check
                id={ `${dataXPath}-${formikField.value}` }
                label={ label }
                disabled={ disabled }
                type='radio'
                { ...formikField }
            />
        )
    },
    type: 'radio',
    fakeDefault: '',
    DefaultWrapper: 'NoneWrapper'
})

