'use strict';
var prefix = require('../../../schema-id-root'),
    systemPermissionsSchema = require('../../system-permissions-schema'),
    testingPermissionsSchema = require('./testing-permissions-schema'),
    internalsSchema = require('./internals-schema');

var {
    DateTime,
} = require('@mpieva/psydb-schema-fields');

var SubjectScientificState = ({
    type,
    customScientificStateSchema
}) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/collection/subject/${type}/scientific/state`,
        type: 'object',
        properties: {
            dateOfBirth: DateTime(),
            custom: customScientificStateSchema,
            testingPermissions: testingPermissionsSchema,
            systemPermissions: systemPermissionsSchema,
            internals: internalsSchema,
        },
        required: [
            'dateOfBirth',
            'custom',
            'testingPermissions',
            'systemPermissions',
            'internals'
        ]
    }

    return schema;
};

module.exports = SubjectScientificState;
