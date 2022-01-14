import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';
import { withField } from '@cdxoo/formik-utils';

import fixSelectProps from '../../fix-select-props';

export const GenericEnum = withField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,
        options,
        enum: enumeration,
        allowedValues,
        disabled,
        manualOnChange,
    } = ps;
    var { error } = formikMeta;

    if (!enumeration) {
        var enumeration = { keys: [], labels: [] };
        for (var it of Object.keys(options)) {
            enumeration.keys.push(it);
            enumeration.labels.push(options[it]);
        }
    }

    allowedValues = allowedValues || enumeration.keys;

    var { onChange, value } = fixSelectProps({
        options: allowedValues,
        dataXPath,
        formikField,
        formikForm,
    });

    if (manualOnChange) {
        onChange = manualOnChange;
    }

    return (
        <Form.Control
            as="select"
            disabled={ disabled }
            isInvalid={ !!error }
            value={ value }
            onChange={ onChange }
        >
            { value === -1 && (
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
