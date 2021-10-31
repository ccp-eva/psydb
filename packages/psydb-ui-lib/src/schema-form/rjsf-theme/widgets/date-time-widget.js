import React, { useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { utils } from "@rjsf/core";
import { Form, InputGroup } from 'react-bootstrap';
import * as wrappers from '../utility-components/wrappers';
import ServerTimezoneContext from '../../../server-timezone-context';

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

const splitISO = (value) => {
    var date, time, fraction;
    if (typeof value === 'string') {
        var match = value.match(/^(.*)T(\d\d:\d\d:\d\d)\.(\d{3})Z$/);
        if (match) {
            ([ date, time, fraction ] = match.slice(1))
        }
    }

    return { date, time, fraction };
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
   
    var serverTimezoneOffset = useContext(ServerTimezoneContext);

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

    //var { date } = splitISO(removeTimezone(value, serverTimezoneOffset));
    var { date } = splitISO(value);
    //console.log({ date });
    
    // usin empty defaults or else react complains about switching
    // controlled to uncontrolled, and when i use null it complains
    // about that too
    var [ cachedDate, setCachedDate ] = useState(date || '');

    var {
        handleChangeDate,
    } = useMemo(() => ({
        handleChangeDate: (event) => {
            var { target: { value }} = event;
            setCachedDate(value);

            var date = value;
            if (date) {
                // FIXME: summer vs winter time
                var fakeISOString = `${date}T12:00:00.000Z`;
                var fakeDate = new Date(fakeISOString);

                if (!isNaN(fakeDate.getTime())) {
                    //var localOffset = fakeDate.getTimezoneOffset();
                    //var delta = localOffset - serverTimezoneOffset;
                    /*var iso = removeTimezone(
                        fakeISOString,
                        serverTimezoneOffset
                    );*/
                    //console.log({ fakeISOString })
                    onChange(fakeISOString);
                }
                else {
                    console.log('INVALID');
                    onChange('INVALID');
                }
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
