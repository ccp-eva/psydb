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
    var { initialValues, onSubmit, useAjvAsync, ...formikOptions } = ps;
    return {
        ...formikOptions,
        initialValues: { '$': (initialValues || {}) },
        onSubmit: (
            useAjvAsync
            ? withAjvErrors({
                callback: (formData, ...other) => (
                    onSubmit(formData['$'], ...other)
                ),
                errorResponsePath: 'data.data.ajvErrors',
                dataPrefix: '$',
            })
            : (formData, ...other) => (
                onSubmit(formData['$'], ...other)
            )
        ),
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
                {(formikProps) => (
                    isFunction(children) && children(formikProps)
                )}
            </DefaultForm>
        </ThemeContext.Provider>
    );

    //return (
    //    <Formik { ...config }>
    //        {(formikProps) => (
    //            <Form className={ className }>
    //                { isFunction(children) && children(formikProps) }
    //            </Form>
    //        )}
    //    </Formik>
    //);
}

export default PsyDBDefaultForm;
