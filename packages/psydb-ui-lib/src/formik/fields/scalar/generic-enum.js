import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import { withField } from '@cdxoo/formik-utils';

import fixSelectProps from '../../fix-select-props';

export const GenericEnum = withField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikForm,
        options,
        enum: enumeration,
        allowedValues,
        disabled,
    } = ps;

    if (!enumeration) {
        var enumeration = { keys: [], labels: [] };
        for (var it of Object.keys(options)) {
            enumeration.keys.push(it);
            enumeration.labels.push(options[it]);
        }
    }

    allowedValues = allowedValues || enumeration.keys;

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
                    { enumeration.labels[index] }
                </option>
            ))}
        </Form.Control>
    )
}});
