'use strict';
var prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema'),
    testingPermissionsSchema = require('./testing-permissions-schema'),
    internalsSchema = require('./internals-schema');

var {
    DateTime,
} = require('@mpieva/psydb-schema-fields');

var createAnimalState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/animal/${key}/state`,
        type: 'object',
        properties: {
            type: { const: 'animal' },
            subtype: { const: key },
            dateOfBirth: DateTime(),
            custom: customInnerSchema,
            testingPermissions: testingPermissionsSchema,
            systemPermissions: systemPermissionsSchema,
            internals: internalsSchema,
        },
        required: [
            'type',
            'subtype',
            'dateOfBirth',
            'custom',
            'testingPermissions',
            'systemPermissions',
            'internals'
        ]
    }

    return schema;
};

module.exports = createAnimalState;
