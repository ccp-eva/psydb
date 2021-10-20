import React from 'react';
import { Formik, Form } from 'formik';

var isFunction = (it) => (typeof it === 'function');

const createFormikConfig = (ps) => {
    // TODO ????
    return {
        initialValues: { '$': {}}
    };
}

const DefaultForm = (ps) => {
    var { children, ...formikOptions } = ps;
    var config = createFormikConfig(ps);
    return (
        <Formik { ...config}>
            {(formikProps) => (
                <Form>
                    { isFunction(children) && children(formikProps) }
                </Form>
            )}
        </Formik>
    );
}

export default DefaultForm;
