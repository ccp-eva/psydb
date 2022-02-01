import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { Form } from '@mpieva/psydb-ui-layout';

import {
    Duration,
    FormattedDuration
} from '@mpieva/psydb-common-lib/src/durations';

export const Time = withField({
    type: 'number',
    fakeDefault: Infinity,

    Control: (ps) => {
        var { dataXPath, formikField, formikForm, disabled } = ps;
        var { value } = formikField;
        var { setFieldValue } = formikForm;

        var wrappedOnChange = (event) => {
            var { target: { value }} = event;
            var sanitizedValue = (
                value === ''
                ? Infinity
                : value
            );

            if (
                value !== undefined
                && value !== null
                && value !== Infinity
            ) {
                try {
                    sanitizedValue = Duration(sanitizedValue)
                } catch (e) {
                    console.log(e);
                }
            }
            
            setFieldValue(dataXPath, sanitizedValue);
            //onChange({ target: { value: sanitizedValue }});
        };

        return (
            <Form.Control
                type='time'
                value={ FormattedDuration(value, { resolution: 'MINUTE' }) }
                onChange={ wrappedOnChange }
                disabled={ disabled }
            />
        )
    },
})

