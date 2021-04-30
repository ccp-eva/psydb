import React, { useState, useEffect, useReducer } from 'react';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';

import ObjectFieldTemplate from './object-field-template';
import ArrayFieldTemplate from './array-field-template';

import MultiSchemaField from './multi-schema-field';
import allWidgets from './widget-aggregator';

var CustomTheme = {
    ...Bootstrap4Theme,
    ObjectFieldTemplate,
    ArrayFieldTemplate,
    widgets: allWidgets,
    fields: {
        ...Bootstrap4Theme.fields,
        OneOfField: MultiSchemaField
    }
}

CustomTheme.FieldTemplate = (ps) => {
    var { children } = ps;
    return (
        <>{ children }</>
    )
}

export default CustomTheme;
