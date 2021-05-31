import React, { useState, useEffect, useReducer } from 'react';
import * as wrappers from '../utility-components/wrappers';

const {
    InlineWrapper
} = wrappers;

const Plain = ({
    properties,
    schema,

    id,
    title,
    required,
    rawErrors = [],

    ...other
}) => {
    var {
        systemType,
        systemProps = {}
    } = schema;

    var Wrapper = wrappers[systemProps.uiWrapper];
    if (!Wrapper) {
        Wrapper = wrappers.PlainWrapper;
    }

    return (
        <Wrapper { ...({
            id, schema, rawErrors,
            label: title,
            required: false,
        }) } >
            { properties.map((element, index) => {
                return <div key={index}>
                    { /*schema.systemType || 'undefined' */}
                    { element.content }
                </div>
            }) }
        </Wrapper>
    )
}

export default Plain;
