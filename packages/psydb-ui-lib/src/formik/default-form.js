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
    var {
        initialValues,
        onSubmit,
        useAjvAsync,
        ajvErrorInstancePathPrefix = '/payload/props',
        extraOKStatusCodes = [],
        ...formikOptions
    } = ps;
    return {
        ...formikOptions,
        initialValues: { '$': (initialValues || {}) },
        onSubmit: (
            useAjvAsync
            ? withAjvErrors({
                callback: (formData, ...other) => (
                    onSubmit(formData['$'], ...other).catch(e => {
                        var statusCode = e.response?.status;
                        if (!extraOKStatusCodes.includes(statusCode)) {
                            throw e
                        }
                    })
                ),
                errorResponsePath: 'data.data.ajvErrors',
                errorInstancePathPrefix: ajvErrorInstancePathPrefix,
                dataPrefix: '$',
            })
            : (formData, ...other) => (
                onSubmit(formData['$'], ...other)
            )
        ),
        noHTML5Validate: true,
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
