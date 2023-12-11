'use strict';

var SimpleMongodbProjection = () => ({
    type: 'object',
    properties: {},
    patternProperties: {
        '^[0-9a-zA-Z]+(\.[0-9a-zA-Z]+)*$': { type: 'boolean', const: true },
    },
    additionalProperties: false,
})

module.exports = SimpleMongodbProjection;
