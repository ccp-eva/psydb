'use strict';
var { DefaultArray, ExactObject } = require('./core-compositions');

var {
    DateTime,
    DateOnlyServerSide
} = require('./date-time');

var {
    BiologicalGender,
    Email,
    Phone,
    ExtBool,
    SaneString,
    FullText,
    ForeignId,
    HelperSetItemId,
    DefaultBool,
    
    Address,
} = require('./common');

var allowedFields = {
    DateTime,
    DateOnlyServerSide,
    
    BiologicalGender,
    Email,
    Phone,
    ExtBool,
    SaneString,
    FullText,
    ForeignId,
    HelperSetItemId,
    DefaultBool,

    Address,
}

var ListOfObjects = ({
    minItems,
    fields,

    ...additionalProperties
}) => DefaultArray({
    systemType: 'ListOfObjects',
    minItems: (minItems || 0),
    items: ExactObject({
        systemType: 'ListOfObjectsItem',
        properties: fields.reduce((acc, definition) => {
            var { type, key, displayName, props } = definition;

            var fieldSchema = allowedFields[type]({
                ...props,
                title: displayName
            });

            return { ...acc, [key]: fieldSchema }
        }, {})
    }),
    ...additionalProperties,
})

module.exports = ListOfObjects;
