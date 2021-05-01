import React, { useState, useEffect, useReducer } from 'react';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';

import ArrayField from '@mpieva/rjsf-monkey-patch/src/array-field';
import SchemaField from '@mpieva/rjsf-monkey-patch/src/schema-field';
import ObjectField from '@mpieva/rjsf-monkey-patch/src/object-field';
import StringField from '@mpieva/rjsf-monkey-patch/src/string-field';

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
        SchemaField,
        ArrayField,
        ObjectField,
        StringField,
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
