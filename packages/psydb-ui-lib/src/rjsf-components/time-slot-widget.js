import React, { useState, useEffect } from 'react';

import {
    Form
} from 'react-bootstrap';

import {
    Duration,
    FormattedDuration,
    HOUR,
    MINUTE
} from '@mpieva/psydb-common-lib/src/durations';

import withFormDecorations from './with-form-decorations';

const TimeSlotWidget = (ps) => {
    const {
        registry: { widgets: { BaseInput }},
        schema,
        uiSchema,
    
        id,
        name,
        value,
        onChange,
        onBlur,
        onFocus,
        required,
    } = ps;

    // fallbacks
    var min = 0;
    var max = 24 * HOUR - 1;
    var step = 1 * HOUR;

    if (schema.formatMinimum) {
        min = Duration(schema.formatMinimum);
    }
    if (schema.formatMaximum) {
        max = Duration(schema.formatMaximum);
    }
    if (schema.formatStep) {
        step = Duration(schema.formatStep);
    }

    var slots = [];
    for (var t = min; t < max; t += step) {
        slots.push(t);
    }

    return (
        <Form.Control
            as='select'
            { ...{
                id,
                name,
                onChange: (event) => {
                    onChange(event);
                },
                onBlur,
                onFocus,
                value
            }}
        >
            { slots.map(it => (
                <option
                    key={ it }
                    value={ FormattedDuration(it) + 'Z' }
                >
                    { FormattedDuration(it, { resolution: 'MINUTE'}) }
                </option>
            ))}
        </Form.Control>
    )
}

const WrappedTimeSlotWidget = withFormDecorations(TimeSlotWidget);
export default WrappedTimeSlotWidget;
