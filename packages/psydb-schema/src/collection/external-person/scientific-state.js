'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema');

var ExternalPersonScientificState = () => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/scientific/state`,
        type: 'object',
        properties: {
            systemPermissions: systemPermissionsSchema,
        },
        required: [
            'systemPermissions',
        ],
    }

    return schema;
};

module.exports = ExternalPersonScientificState;
