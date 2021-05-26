import React, { useState, useEffect, useReducer } from 'react';
import * as wrappers from '../utility-components/wrappers';

const {
    InlineWrapper
} = wrappers;

export const Plain = ({
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

export const Address = (ps) => {
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
        country,
        city,
        postcode,
        street,
        housenumber,
        affix,
    ] = properties;

    return (
        <InlineWrapper { ...({
            id, schema, rawErrors,
            label: title,
            required: false,
        }) }>
            <div className='border p-3'>
                <div
                    className='d-flex'
                    style={{ paddingLeft: '15px' }}
                >
                    <div className='flex-grow'>
                        { street.content }
                    </div>
                    <div className='pl-2' style={{ flexBasis: '7rem' }}>
                        { housenumber.content }
                    </div>
                    <div className='pl-2' style={{ flexBasis: '7rem' }}>
                        { affix.content }
                    </div>
                </div>
                <div
                    className='d-flex'
                    style={{ paddingLeft: '15px' }}
                >
                    <div style={{ flexBasis: '7rem' }}>
                        { postcode.content }
                    </div>
                    <div className='flex-grow pl-2'>
                        { city.content }
                    </div>
                    <div
                        className='pl-2'
                        style={{ flexBasis: '27%' }}
                    >
                        { country.content }
                    </div>
                </div>
            </div>
        </InlineWrapper>
    )
}
