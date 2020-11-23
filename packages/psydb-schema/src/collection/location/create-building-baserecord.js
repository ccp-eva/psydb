'use strict';
var { Address } = require('@mpieva/psydb-schema-fields'),
    prefix = require('./schema-id-prefix');

var createBuildingBaseRecord = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/building/${key}/baserecord`,
        allOf: [
            {
                type: 'object',
                properties: {
                    type: { const: 'building' },
                    subtype: { const: key },
                    name: { type: 'string' },
                    address: Address(),
                },
                required: [
                    'type',
                    'subtype',
                    'name',
                    'address',
                ]
            },
            customInnerSchema,
        ]
    };

    return schema;
};

module.exports = createBuildingBaseRecord;
