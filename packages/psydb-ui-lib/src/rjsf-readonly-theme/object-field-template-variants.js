import React, { useState, useEffect, useReducer } from 'react';
import { InlineWrapper } from './wrapper-components';

export const Plain = ({
    properties,
    schema,
    ...other
}) => {
    console.log(other);
    return (
        <>
            { properties.map((element, index) => {
                return <div key={index}>
                    { /*schema.systemType || 'undefined' */}
                    { element.content }
                </div>
            }) }
        </>
    )
}

export const Address = ({
    title,
    formData
}) => {
    return (
        <InlineWrapper label={ title }>
            <div>
                { formData.street }
                {' '}
                { formData.housenumber }
                {' '}
                { formData.affix }
            </div>
            <div>
                { formData.postcode }
                {' '}
                { formData.city }
                {' '}
                ({ formData.country})
            </div>
        </InlineWrapper>
    )
}
