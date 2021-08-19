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

/*import ArrayField from '@mpieva/rjsf-monkey-patch/src/array-field';
import SchemaField from '@mpieva/rjsf-monkey-patch/src/schema-field';
import ObjectField from '@mpieva/rjsf-monkey-patch/src/object-field';

import BooleanField from '@mpieva/rjsf-monkey-patch/src/boolean-field';
import StringField from '@mpieva/rjsf-monkey-patch/src/string-field';

import MultiSchemaField from '@mpieva/rjsf-monkey-patch/src/multi-schema-field';*/

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
