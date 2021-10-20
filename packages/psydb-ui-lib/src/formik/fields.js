import React from 'react';
import { Field } from 'formik';
import { Form as BSForm } from '@mpieva/psydb-ui-layout';
import fakeControlledInput from './fake-controlled-input';

const SaneStringField = (ps) => {
    var { path } = ps;
    return (
        <Field type='text' name={ path }>
            {(formikProps) => {
                var { field, meta, form } = formikProps;
                field = fakeControlledInput(field, '');
                return (
                    <BSForm.Control type='text' { ...field } />
                )
            }}
        </Field>
    )
}

export {
    SaneStringField
}
