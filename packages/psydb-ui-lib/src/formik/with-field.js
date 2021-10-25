import React from 'react';
import { Field } from 'formik';
import { FormHelpers } from '@mpieva/psydb-ui-layout';

import fakeControlledInput from './fake-controlled-input';

const WithField = (options) => (ps) => {
    var {
        Control,
        DefaultWrapper = FormHelpers.InlineWrapper,
        InArrayWrapper = FormHelpers.NoneWrapper,
        type = 'text',
        fakeDefault = '',
    } = options;

    var {
        dataXPath,
        label,
        required,
        inArray,
        noWrapper,
    } = ps;

    var Wrapper = (
        inArray
        ? InArrayWrapper
        : DefaultWrapper
    );

    if (noWrapper) {
        Wrapper = FormHelpers.NoneWrapper;
    }

    return (
        <Field type={ type } name={ dataXPath }>
            {(formikProps) => {
                var { field, meta, form } = formikProps;
                field = fakeControlledInput(field, fakeDefault);

                return (
                    <Wrapper
                        label={ label }
                        required={ required }
                        hasError={ !!meta.error }
                    >
                        <Control {...({
                            ...ps,
                            formikField: field,
                            formikMeta: meta,
                            formikForm: form
                        }) } />
                    </Wrapper>
                )
            }}
        </Field>
    )
}

export default WithField;
