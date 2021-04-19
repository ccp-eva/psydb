import React, { useState, useEffect } from 'react';

import {
    Duration,
    FormattedDuration,
    HOUR,
    MINUTE
} from '@mpieva/psydb-common-lib/src/durations';

const TimeSlotWidget = (ps) => {
    const {
        registry: { widgets: { BaseInput }},
        schema,
        uiSchema,
        
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

    console.log(schema);

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
        <select>
            { slots.map(it => (
                <option key={ it }>
                    { FormattedDuration(it, { resolution: 'MINUTE'}) }
                </option>
            ))}
        </select>
    )
}

export default TimeSlotWidget;
