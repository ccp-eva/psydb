'use strict';
var prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema'),
    internalsSchema = require('./internals-schema');

var createHumanState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/human/${key}/state`,
        type: 'object',
        properties: {
            type: { const: 'human' },
            subtype: { const: key },
            custom: customInnerSchema,
            systemPermissions: systemPermissionsSchema,
            internals: internalsSchema,
        },
        required: [
            'type',
            'subtype',
            'custom',
            'systemPermissions',
            'internals'
        ]

    }

    return schema;
};

module.exports = createHumanState;
