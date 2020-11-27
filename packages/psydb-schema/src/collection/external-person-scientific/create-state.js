'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema');

var {
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var createExternalPersonScientificState = (key) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/${key}/state`,
        type: 'object',
        properties: {
            type: { const: key },
            systemPermissions: systemPermissionsSchema,
            internals: {
                type: 'object',
                properties: {
                    externalPersonGdprId: (
                        ForeignId('externalPersonGdpr')
                    ),
                },
                required: [
                    'externalPersonGdprId',
                ],
            }
        },
        required: [
            'type',
            'systemPermissions',
            'internals',
        ],
    }

    return schema;
};

module.exports = createExternalPersonScientificState;
