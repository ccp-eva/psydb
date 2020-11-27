'use strict';
var prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema');

var createExternalOrganizationState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/${key}/state`,
        type: 'object',
        properties: {
            type: { const: key },
            name: { type: 'string' },
            custom: customInnerSchema,
            systemPermissions: systemPermissionsSchema,
            // TODO: do we need separate gdpr portion for that?
            //internals: {},
        },
        required: [
            'type',
            'name',
            'custom',
            'systemPermissions',
            //'internals',
        ]
    }

    return schema;
};

module.exports = createExternalOrganizationState;
