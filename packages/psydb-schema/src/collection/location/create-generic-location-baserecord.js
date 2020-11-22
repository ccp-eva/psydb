'use strict';
var prefix = require('./schema-id-prefix');

var createGenericLocationBaseRecord = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/${key}/baserecord`,
        allOf: [
            {
                type: 'object',
                properties: {
                    type: { const: key },
                    name: { type: 'string' },
                },
                required: [
                    'type',
                    'name',
                ]
            },
            customInnerSchema,
        ]
    } 
};

module.exports = createGenericLocationBaseRecord;
