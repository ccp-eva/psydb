'use strict';
var prefix = require('../../schema-id-root'),
    systemPermissionsSchema = require('../system-permissions-schema');

var ExternalOrganizationState = ({ type, customStateSchema }) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/collection/external-organization/${type}/state`,
        type: 'object',
        properties: {
            name: { type: 'string' },
            custom: customStateSchema,
            systemPermissions: systemPermissionsSchema,
        },
        required: [
            'name',
            'custom',
            'systemPermissions',
        ]
    }

    return schema;
};

module.exports = ExternalOrganizationState;
