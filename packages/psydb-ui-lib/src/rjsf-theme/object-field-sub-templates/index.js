import React, { useState, useEffect, useReducer } from 'react';

export const Plain = ({
    properties,
    schema,
    ...other
}) => {
    return (
        <>
            { properties.map((element, index) => {
                return <div id='el' key={index}>
                    { /*schema.systemType || 'undefined' */}
                    { element.content }
                </div>
            }) }
        </>
    )
}

