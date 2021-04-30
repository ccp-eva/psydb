import React, { useState, useEffect, useReducer } from 'react';
import * as subTemplates from './object-field-template-variants';

const ObjectFieldTemplate = (ps) => {
    var {
        schema
    } = ps;

    var { systemType } = schema;

    var Variant = subTemplates[systemType];
    if (!Variant) {
        Variant = subTemplates.Plain
    };
    
    return (
        <Variant { ...ps } />
    )
};


export default ObjectFieldTemplate;
