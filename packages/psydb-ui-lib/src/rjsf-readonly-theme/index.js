import React, { useState, useEffect, useReducer } from 'react';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';

import fields from '@mpieva/rjsf-monkey-patch/src/core/components/fields';
var {
    ArrayField,
    SchemaField,
    ObjectField,
    
    BooleanField,
    StringField,
    OneOfField,
} = fields;

import ObjectFieldTemplate from './object-field-template';
import ArrayFieldTemplate from './array-field-template';

import allWidgets from './widget-aggregator';

var CustomTheme = {
    ...Bootstrap4Theme,
    ObjectFieldTemplate,
    ArrayFieldTemplate,
    widgets: allWidgets,
    fields: {
        ...Bootstrap4Theme.fields,
        SchemaField,
        ArrayField,
        ObjectField,
        StringField,
        BooleanField,
        OneOfField,
    }
}

CustomTheme.FieldTemplate = (ps) => {
    var { children } = ps;
    return (
        <>{ children }</>
    )
}

export default CustomTheme;
