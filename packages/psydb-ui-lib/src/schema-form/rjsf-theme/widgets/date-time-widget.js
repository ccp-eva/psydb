import React, { useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';

import { utils } from "@rjsf/core";
import { Form, InputGroup } from 'react-bootstrap';
import * as wrappers from '../utility-components/wrappers';
import ServerTimezoneContext from '../../../server-timezone-context';

import {
    splitISO,
    checkDate,
    canSwap,
    createInitialDate,
    canParseBack,
    parseBack,
} from '../../../date-only-helpers';

const removeTimezone = (str, offset = 60) => {
    if (typeof str === 'string') {
        var date = new Date(str);
        if (!isNaN(date.getTime())) {
            var offset = date.getTimezoneOffset() * offset * 1000;
            str = new Date(date.getTime() + offset).toISOString();
        }
    }
    return str;
}

const addTimezone = (str, offset = 60) => {
    if (typeof str === 'string') {
        var date = new Date(str);
        if (!isNaN(date.getTime())) {
            var offset = date.getTimezoneOffset() * offset * 1000;
            str = new Date(date.getTime() + offset).toISOString();
        }
    }
    return str;
}

// because firefox wants to display seconds
// if set in value
const stripSeconds = (str) => {
    if (typeof str === 'string') {
        if (/^\d\d:\d\d:\d\d$/.test(str)) {
            str = str.substr(0, 5);
        }
    }
    return str
}

const DefaultDateTimeWidget = (ps) => {

    var {
        id,
        type,
        label,
        value,
        required,
        onChange,
        options,
        schema,
        formContext,
        rawErrors = [],

        isArrayItem,
    } = ps;
   
    var {
        systemType,
        systemProps = {}
    } = schema;

    var Wrapper = wrappers[systemProps.uiWrapper];
    if (!Wrapper) {
        if (isArrayItem) {
            Wrapper = wrappers.OneLineWrapper;
        }
        else {
            Wrapper = wrappers.InlineWrapper;
        }
    }
    
    var hasErrors = rawErrors.length > 0;
    var className = hasErrors ? 'is-invalid' : '';

    var { date, time, fraction } = splitISO(removeTimezone(value));
    
    // usin empty defaults or else react complains about switching
    // controlled to uncontrolled, and when i use null it complains
    // about that too
    var [ cachedDate, setCachedDate ] = useState(date || '');
    var [ cachedTime, setCachedTime ] = useState(time ? stripSeconds(time) : '');
    var [ cachedFraction, setCachedFraction ] = useState(fraction || '000');
  
    var {
        handleChangeDate,
        handleChangeTime
    } = useMemo(() => ({
        handleChangeDate: (event) => {
            var { target: { value }} = event;
            setCachedDate(value);
        },
        handleChangeTime: (event) => {
            var { target: { value }} = event;
            setCachedTime(value);
        }
    }), []);

    useEffect(() => {
        var date = cachedDate;
        var time = cachedTime;
        var fraction = cachedFraction;

        if (date && time && fraction) {
            // if resolution is only minute append seconds
            if (/^\d\d:\d\d$/.test(time)) {
                time += ':00';
            }

            var fakeISOString = `${date}T${time}.${fraction}Z`;
            var fakeDate = new Date(fakeISOString);

            if (!isNaN(fakeDate.getTime())) {
                var iso = addTimezone(fakeISOString);
                onChange(iso);
            }
            else {
                console.log('INVALID');
                onChange('INVALID');
            }
        }
    }, [ cachedDate, cachedTime, cachedFraction, onChange ])

    return (
        <Wrapper { ...({
            id, label, required, schema, rawErrors
        }) }>
            <InputGroup>
                <Form.Control {...({
                    id: `${id}_DATE`,
                    className,
                    type: 'date',
                    value: cachedDate,
                    onChange: handleChangeDate,
                })} />
                <Form.Control {...({
                    id: `${id}_DATE`,
                    className,
                    type: 'time',
                    value: cachedTime,
                    onChange: handleChangeTime,
                })} />
            </InputGroup>
        </Wrapper>
    )
};

const DateOnlyServerSideWidget = (ps) => {

    var {
        id,
        type,
        label,
        value,
        required,
        onChange,
        options,
        schema,
        formContext,
        rawErrors = [],

        isArrayItem,
    } = ps;
   
    var {
        systemType,
        systemProps = {}
    } = schema;

    var Wrapper = wrappers[systemProps.uiWrapper];
    if (!Wrapper) {
        if (isArrayItem) {
            Wrapper = wrappers.OneLineWrapper;
        }
        else {
            Wrapper = wrappers.InlineWrapper;
        }
    }
    
    var hasErrors = rawErrors.length > 0;
    var className = hasErrors ? 'is-invalid' : '';

    var serverTimezone = useContext(ServerTimezoneContext);
    var clientTimezone = getSystemTimezone();

    var initialDate = createInitialDate({
        value,
        serverTimezone,
        clientTimezone,
        isInitialValueSwapped: true,
    })
    
    var [ cachedDate, setCachedDate ] = useState(initialDate || '');

    var {
        handleChangeDate,
    } = useMemo(() => ({
        handleChangeDate: (event) => {
            var { target: { value }} = event;
            setCachedDate(value);

            if (canParseBack(value)) {
                var date = parseBack(value);

                console.log({ date: date.toISOString() });
                onChange(date.toISOString());
            }
            else {
                console.log('INVALID')
                onChange('INVALID');
            }
        },
    }), [ cachedDate, onChange ]);

    return (
        <Wrapper { ...({
            id, label, required, schema, rawErrors
        }) }>
            <InputGroup>
                <Form.Control {...({
                    id: `${id}_DATE`,
                    className,
                    type: 'date',
                    value: cachedDate,
                    onChange: handleChangeDate,
                })} />
            </InputGroup>
        </Wrapper>
    )
}

const DateTimeWidget = (ps) => {
    var { schema } = ps;
    if (schema.systemType === 'DateOnlyServerSide') {
        return <DateOnlyServerSideWidget { ...ps} />
    }
    else {
        return <DefaultDateTimeWidget { ...ps} />
    }
}

export default DateTimeWidget;
