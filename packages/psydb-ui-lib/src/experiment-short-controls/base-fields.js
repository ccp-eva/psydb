import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

import datefns from '../date-fns';

const wrapOnChange = (onChange) => (event) => {
    var { target: { value }} = event;
    return onChange(value);
}

const BoolControl = ({
    value,
    onChange
}) => {
    var [ internalValue, setInternalValue ] = useState(0);
    var options = [
        { label: 'Nein', value: false },
        { label: 'Ja' , value: true }
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

const SlotControl = ({
    value,
    onChange,
    min,
    max,
    step,
}) => {
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
                    { datefns.format(it, 'p') }
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
