'use strict';
var prefix = require('../../../schema-id-root'),
    systemPermissionsSchema = require('../../system-permissions-schema');

var SubjectGdprState = ({
    type,
    customGdprStateSchema
}) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/collection/subject/${type}/gdpr/state`,
        type: 'object',
        properties: {
            custom: customGdprStateSchema,
        },
        required: [
            'custom',
        ]

    }

    return schema;
};

module.exports = SubjectGdprState;
