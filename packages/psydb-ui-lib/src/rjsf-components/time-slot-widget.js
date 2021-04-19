import React, { useState, useEffect } from 'react';

import {
    Duration,
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

    return (
        <select>
            <option>Foo</option>
        </select>
    )
}

export default TimeSlotWidget;
