'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema');

var {
    ExactObject,
    ForeignId,

    SaneString,
    Color,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

// TODO: stub; needs conditions handling somehow
// also we need condition templates for study types
var StudyState = ({
    type,
    customStateSchema,
    enableInternalProps
}) => {
    var schema = ExactObject({
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/${type}/state`,
        properties: {
            name: SaneString(),
            shorthand: SaneString(),
            researchGroupIds: {
                type: 'array',
                minItems: 1,
                items: ForeignId('researchGroup'),
                description: inline`
                    this list of ids will be used to get the permissions
                    for when we search in this studies context
                    for subjects or when checking foreign key field
                    permissions on the related collections records
                    i.e. it overrides the user role permission
                    in certain cases
                `,
            },
            
            custom: customStateSchema,
            systemPermissions: systemPermissionsSchema,
            
            ...(enableInternalProps && {
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
            })
        },
        required: [
            'name',
            'shorthand',
            'researchGroupIds',
            'custom',
            'systemPermissions',
            ...(
                enableInternalProps
                ? [ 'internals' ]
                : []
            ),
        ],
    });

    return schema;
};

module.exports = StudyState;
