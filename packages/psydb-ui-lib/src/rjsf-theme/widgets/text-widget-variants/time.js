import React, { useCallback } from 'react';
import { Form } from 'react-bootstrap';

import {
    Duration,
    FormattedDuration
} from '@mpieva/psydb-common-lib/src/durations';

const Time = ({
    id,
    className,
    type,
    value,
    onChange,
    options,
    ...other
}) => {
    var wrappedOnChange = useCallback((event) => {
        var { target: { value }} = event;
        console.log(value);
        var sanitizedValue = (
            value === ''
            ? options.emptyValue
            : value
        );

        if (
            value !== undefined
            && value !== null
            && value !== options.emptyValue
        ) {
            try {
                sanitizedValue = Duration(sanitizedValue)
            } catch (e) {
                console.log(e);
            }
        }

        onChange({ target: { value: sanitizedValue }});
    }, [ onChange ]);

    return (
        <Form.Control {...({
            id,
            className,
            type: 'time',
            value: FormattedDuration(value, { resolution: 'MINUTE' }),
            onChange: wrappedOnChange,
        })} />
    )
}

export default Time;


