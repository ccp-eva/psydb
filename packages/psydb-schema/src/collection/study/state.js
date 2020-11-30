'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix');

var {
    ForeignId,

    SaneString,
    Color,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var createStudyState = () => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/state`,
        type: 'object',
        properties: {
            name: SaneString(),
            shorthand: SaneString(),
            instituteIds: {
                type: 'array',
                minItems: 1,
                items: ForeignId('institute'),
                description: inline`
                    this list of ids will be used to get the permissions
                    for when we search in this studies context
                    for subjects or when checking foreign key field
                    permissions on the related collections records
                    i.e. it overrides the user role permission
                    in certain cases
                `,
            },
            custom: customInnerSchema,
            interals: {
                type: 'object',
                properties: {
                    experimentOperatorTeamIds: {
                        type: 'array',
                        default: [],
                        items: ForeignId('experimentOperatorTeam'),
                    },
                },
                required: [
                    'experimentOperatorTeamIds',
                ],
            },
        },
        required: [
            'name',
            'instituteIds',
        ],
    }

    return schema;
};

module.exports = createExperimentOperatorTeamState;
