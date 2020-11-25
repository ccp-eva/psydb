'use strict';
var prefix = require('./schema-id-prefix'),
    coreState = require('./core-subject-gdpr-state'),
    createBaseRecord = require('./create-human-baserecord');

var createHumanState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/human/${key}/state`,
        type: 'object',
        properties: {
            type: 'object',
            properties: {
                type: { const: 'human' },
                subtype: { const: key },
                custom: customInnerSchema,
                systemPermissions: systemPermissionsSchema,
                internals: {
                    type: 'object',
                    properties: {
                        subjectScientificId: ForeignId('subjectScientific'),
                    },
                    required: [
                        'subjectScientificId',
                    ]
                }
            },
            required: [
                'type',
                'subtype',
                'custom',
                'systemPermissions',
                'internals'
            ]
        }
    }

    return schema;
};

module.exports = createHumanState;
