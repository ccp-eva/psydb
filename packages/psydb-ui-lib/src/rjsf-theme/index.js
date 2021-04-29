import React, { useState, useEffect, useReducer } from 'react';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';

import ObjectFieldTemplate from './object-field-template';
import ArrayFieldTemplate from './array-field-template';

import * as widgets from './widgets';
import MultiSchemaField from './multi-schema-field';

console.log(Bootstrap4Theme.fields);

var CustomTheme = {
    ...Bootstrap4Theme,
    ObjectFieldTemplate,
    ArrayFieldTemplate,
    widgets: { ...Bootstrap4Theme.widgets, ...widgets },
    fields: { ...Bootstrap4Theme.fields, OneOfField: MultiSchemaField }
}

CustomTheme.FieldTemplate = (ps) => {
    var { children } = ps;
    return (
        <>{ children }</>
    )
}

export default CustomTheme;
