import React, { useState, useEffect, useReducer } from 'react';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';

import MultiSchemaField from '@mpieva/rjsf-monkey-patch/src/multi-schema-field';
import ObjectFieldTemplate from './object-field-template';
import ArrayFieldTemplate from './array-field-template';

import allWidgets from './widget-aggregator';

//console.log(Bootstrap4Theme.fields);
//console.log(allWidgets);

var CustomTheme = {
    ...Bootstrap4Theme,
    ObjectFieldTemplate,
    ArrayFieldTemplate,
    //widgets: { ...Bootstrap4Theme.widgets, ...widgets },
    widgets: allWidgets,
    fields: { ...Bootstrap4Theme.fields, OneOfField: MultiSchemaField }
}

CustomTheme.FieldTemplate = (ps) => {
    var { children } = ps;
    return (
        <>{ children }</>
    )
}

export default CustomTheme;
