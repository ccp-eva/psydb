import React, { useCallback } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

import ageFrameUtils from '@mpieva/psydb-common-lib/src/age-frame-utils';

const DaysSinceBirth = ({
    id,
    className,
    type,
    value,
    onChange,
    options,
    ...other
}) => {

    var propValue = value;
    var onChangeComponent = useCallback((key, event) => {
        var { target: { value }} = event;
        
        var components = ageFrameUtils.split(propValue);
        components[key] = parseInt(value);
        
        var combined = ageFrameUtils.combine(components);

        return onChange(combined);
    });

    var onChangeYears = useCallback((e) => onChangeComponent('years', e));
    var onChangeMonths = useCallback((e) => onChangeComponent('months', e));
    var onChangeDays = useCallback((e) => onChangeComponent('days', e));

    var { years, months, days } = ageFrameUtils.split(value);
    return (
        <InputGroup>
            <Form.Control {...({
                id: `${id}_years`,
                className,
                type: 'number',
                min: 0,
                step: 1,
                value: String(years), // this is so dump
                onChange: onChangeYears,
            })} />
            <Form.Control {...({
                id: `${id}_months`,
                type: 'number',
                min: 0,
                //max: 11,
                step: 1,
                value: String(months),
                onChange: onChangeMonths,
            })} />
            <Form.Control {...({
                id: `${id}_days`,
                type: 'number',
                min: 0,
                //max: 29,
                step: 1,
                value: String(days),
                onChange: onChangeDays,
            })} />
            <InputGroup.Append>
                <InputGroup.Text>Jahre / Monate / Tage</InputGroup.Text>
            </InputGroup.Append>
        </InputGroup>
    )
}

export default DaysSinceBirth;


