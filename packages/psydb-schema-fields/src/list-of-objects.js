'use strict';
var DefaultArray = require('./default-array'),
    ExactObject = require('./exact-object');

var allowedFields = {
    DateTime: require('./date-time'),
    DateOnlyServerSide: require('./date-only-server-side'),
    BiologicalGender: require('./biological-gender'),
    Email: require('./email'),
    Phone: require('./phone'),
    ExtBool: require('./ext-bool'),
    SaneString: require('./sane-string'),
    FullText: require('./full-text'),
    ForeignId: require('./foreign-id'),
    HelperSetItemId: require('./helper-set-item-id'),
    DefaultBool: require('./default-bool'),
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
