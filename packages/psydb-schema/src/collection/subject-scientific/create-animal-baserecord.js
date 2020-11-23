'use strict';
var prefix = require('./schema-id-prefix');

var createHumanBaseRecord = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/animal/${key}/baserecord`,
        allOf: [
            {
                type: 'object',
                properties: {
                    type: { const: 'animal' },
                    subtype: { const: key },
                },
                required: [
                    'type',
                    'subtype',
                ]
            },
            customInnerSchema,
        ]
    };

    return schema;
};

module.exports = createHumanBaseRecord;
