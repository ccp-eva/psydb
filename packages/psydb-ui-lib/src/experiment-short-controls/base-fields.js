import React, { useState } from 'react';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { Form } from '@mpieva/psydb-ui-layout';

import datefns from '../date-fns';

const wrapOnChange = (onChange) => (event) => {
    var { target: { value }} = event;
    return onChange(value);
}

const BoolControl = (ps) => {
    var {
        value,
        onChange
    } = ps;

    var translate = useUITranslation();
    var [ internalValue, setInternalValue ] = useState(0);

    var options = [
        { label: translate('No'), value: false },
        { label: translate('Yes') , value: true }
    ];

    var wrappedOnChange = (event) => {
        var { target: { value }} = event;
        setInternalValue(value);
        var realValue = options[value].value;
        return onChange({ target: { value: realValue }});
    };

    return (
        <Form.Control { ...({
            as: 'select',
            onChange: wrappedOnChange,
            value: internalValue
        }) } >
            { options.map(({ label, value }, index) => (
                <option
                    key={ index }
                    value={ index }
                >
                    { label }
                </option>
            ))}
        </Form.Control>
    )
}

const SlotControl = (ps) => {
    var {
        value,
        onChange,
        min,
        max,
        step,
    } = ps;

    var locale = useUILocale();

    var slots = [];
    for (var t = min.getTime(); t < max.getTime(); t += step) {
        slots.push(new Date(t));
    }

    var [ internalValue, setInternalValue ] = useState(0);
    var wrappedOnChange = (event) => {
        var { target: { value }} = event;
        setInternalValue(value);
        var realValue = slots[value];
        return onChange({ target: { value: realValue }});
    };


    return (
        <Form.Control { ...({
            as: 'select',
            onChange: wrappedOnChange,
            value: internalValue,
        }) } >
            { slots.map((it, index) => (
                <option
                    key={ it }
                    value={ index }
                >
                    { datefns.format(
                        new Date(it.getTime() + 1), 'p', { locale }
                    ) }
                </option>
            ))}
        </Form.Control>
    )
}

export {
    wrapOnChange,
    BoolControl,
    SlotControl,
}
