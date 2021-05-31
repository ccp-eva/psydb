import React, { useState, useEffect, useReducer } from 'react';
import * as wrappers from '../utility-components/wrappers';

const {
    InlineWrapper
} = wrappers;

const WeekdayBoolObject = (ps) => {
    var {
        id,
        title,
        required,
        schema,
        rawErrors = [],
        properties,
    } = ps;

    // XXX for some reason the props
    // in country.content.props arent sufficient
    // to instantiate a select widget thjere is no "options"
    // and for text widgets there is no 'value'
    var [
        mon,
        tue,
        wed,
        thu,
        fri,
        sat,
        sun
    ] = properties;

    return (
        <InlineWrapper { ...({
            id, schema, rawErrors,
            label: title,
            required: false,
        }) }>
            <div className='border p-3 d-flex justify-content-between'>
                { mon.content }
                { tue.content }
                { wed.content }
                { thu.content }
                { fri.content }
                { sat.content }
                { sun.content }
            </div>
        </InlineWrapper>
    )
}

export default WeekdayBoolObject;
