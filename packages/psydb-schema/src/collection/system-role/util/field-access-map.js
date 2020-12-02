'use strict';
var FieldAccess = require('./field-access');

var FieldAccessMap = ({
    schema,
    isNested,
}) => {
    var excludedFields = (
        isNested
        ? []
        : ['type', 'subtype', 'internals']
    );

    var accessMapProps = (
        Object.keys(schema.properties)
        .filter(key => (
            !excludedFields.includes(key)
        ))
        .reduce((acc, key) => ({
            ...acc,
            [key]: (
                key === 'custom' && !isNested
                ? FieldAccessMap({ schema: schema.properties[key] })
                : FieldAccess({ implicitRead: false })
            )
        }), {})
    );

    return {
        type: 'object',
        properties: accessMapProps,
        required: Object.keys(accessMapProps),
    };
}

module.exports = FieldAccessMap;
