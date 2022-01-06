import React from 'react';
import { Formik, Form } from 'formik';
import { withAjvErrors } from '@cdxoo/formik-ajv-async';
import {
    DefaultForm,
    ThemeContext
} from '@cdxoo/formik-utils';

import * as Theme from './theme';

var isFunction = (it) => (typeof it === 'function');

const createFormikConfig = (ps) => {
    var { initialValues, onSubmit, ...formikOptions } = ps;
    return {
        ...formikOptions,
        initialValues: { '$': (initialValues || {}) },
        onSubmit: withAjvErrors({
            callback: (formData, ...other) => (
                onSubmit(formData['$'], ...other)
            ),
            dataPrefix: '$',
        }),
        validateOnChange: false,
        validateOnBlur: false,
    };
}

const PsyDBDefaultForm = (ps) => {
    var { className, children, ...formikOptions } = ps;
    var config = createFormikConfig(ps);
    return (
        <ThemeContext.Provider value={ Theme }>
            <DefaultForm { ...config }>
                { isFunction(children) && children(formikProps) }
            </DefaultForm>
        </ThemeContext.Provider>
    );

    return (
        <Formik { ...config }>
            {(formikProps) => (
                <Form className={ className }>
                    { isFunction(children) && children(formikProps) }
                </Form>
            )}
        </Formik>
    );
}

export default PsyDBDefaultForm;
