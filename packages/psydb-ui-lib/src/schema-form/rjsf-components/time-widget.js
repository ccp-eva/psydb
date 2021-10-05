import React, { useState, useEffect } from 'react';

import 'react-datetime/css/react-datetime.css';
import DateTimePicker from 'react-datetime'

import {
    Duration,
    HOUR,
    MINUTE
} from '@mpieva/psydb-common-lib/src/durations';

import datefns from '../../date-fns';

const extractTime = (dateIsoString) => {
    var date = new Date(dateIsoString);
    if (NaN === date.getTime()) {
        return NaN;
    }

    return (
        date.getHours() * HOUR + date.getMinutes() * MINUTE        
    )
};

const TimeWidget = (ps) => {
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

    var labelString = (
        uiSchema["ui:title"] || schema.title || name
    )

    var timeConstraints = {};
    if (schema.formatMinimum || schema.formatMaximum) {
        timeConstraints.hours = {};
        timeConstraints.minutes = {};
    }
    if (schema.formatMinimum) {
        var t = extractTime(schema.formatMinimum);
        var hours = Math.floor(t / HOUR);
        var minutes = Math.floor((t - hours * HOUR) / MINUTE);
        timeConstraints.hours.min = hours;
        timeConstraints.minutes.min = minutes;
    }
    if (schema.formatMaximum) {
        var t = extractTime(schema.formatMaximum);
        var hours = Math.floor(t / HOUR);
        var minutes = Math.floor((t - hours * HOUR) / MINUTE);
        timeConstraints.hours.max = hours;
        timeConstraints.minutes.max = minutes;
    }
    console.log(timeConstraints);

    return (
        <>
            <DateTimePicker
                value={ new Date(value || schema.default) }
                dateFormat={ false }
                onChange={ (moment) => {
                    console.log(moment);
                    onChange(moment.toDate().toISOString())
                } }
                timeConstraints={ timeConstraints }
            />
        </>
    )


    // XXX: since <input type='time'> does neither respect min,max nor step
    // for selecting the date time from the dropdown we needed to pull
    // react-datetime large and also relies on momment.js whuch is even
    // larger
    /*var schemaTimes = getTimeDataFromSchema(schema);
    var valueTime = extractTime(value);
    var dayStart = datefns.startOfUTCDay(value);
    return (
        <BaseInput
            { ...ps }
            type='time'
            value={ valueTime }
            min={ schemaTimes.formatMinimum }
            max={ schemaTimes.formatMaximum }
            step="120"
            onChange={ (...args) => {

                onChange(...args);
            }}
        />
    )*/
}

// XXX: see above
/*const extractTime = (dateIsoString) => (
    NaN !== (new Date(dateIsoString)).getTime()
    ? datefns.format(new Date(dateIsoString), 'HH:mm')
    : dateIsoString
);

const getTimeDataFromSchema = (schema) => {
    var sane = {};
    [
        'default',
        'formatMinimum',
        'formatMaximum'
    ].forEach(key => {
        if (schema[key]) {
            sane[key] = extractTime(schema[key]);
        }
    });

    if (schema.formatStep) {
        // no change here its custom a custom keyword
        sane.formatTimeStep = schema.formatTimeStep;
    }
    return sane;
}*/

export default TimeWidget;
