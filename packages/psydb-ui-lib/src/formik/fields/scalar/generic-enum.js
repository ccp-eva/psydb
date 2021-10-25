import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import WithField from '../../with-field';

import fixSelectProps from '../../fix-select-props';

export const GenericEnum = WithField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikForm,
        options,
        allowedValues,
        disabled,
    } = ps;

    allowedValues = allowedValues || Object.keys(options);

    var controlProps = fixSelectProps({
        options: allowedValues,
        dataXPath,
        formikField,
        formikForm,
    });

    return (
        <Form.Control as="select" disabled={ disabled } { ...controlProps }>
            { controlProps.value === -1 && (
                <option></option>
            )}
            { allowedValues.map((k, index) => (
                <option key={ index } value={ index }>
                    { options[k] }
                </option>
            ))}
        </Form.Control>
    )
}});
