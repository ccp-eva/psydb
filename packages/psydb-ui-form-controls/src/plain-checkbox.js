import React from 'react';
import { Form } from '@mpieva/psydb-ui-layout';

// FIXME: bootstrap setting 'for' in label breaks in lists
export const PlainCheckbox = (ps) => {
    var { value, checked, onChange, useRawOnChange = false, ...pass } = ps;
    if (!useRawOnChange) {
        ({ checked, onChange } = fixCheckbox({ value, onChange }))
    }
    return (
        <Form.Check
            value={ value }
            checked={ checked }
            onChange={ onChange }
            { ...pass }
        />
    )
}

const fixCheckbox = ({ value, onChange }) => ({
    checked: value === true,
    onChange: (event) => {
        var { target: { checked }} = event;
        onChange(!!checked);
    }
})
