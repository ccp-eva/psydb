'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    ForeignId,
    DateTimeInterval,
    ExtBool,
} = require('@mpieva/psydb-schema-fields');

var ExtBoolPermissionList = ({ description } = {}) => ({
    type: 'array',
    default: [],
    items: ExactObject({
        properties: {
            researchGroupId: ForeignId({
                collection: 'researchGroup'
            }),
            permission: ExtBool(),
        },
        required: [
            'researchGroupId',
            'permission',
        ]
    })
});

var testingPermissionsSchema = ExactObject({
    properties: {
        
        canBeTestedInhouse: ExtBoolPermissionList({
            description: inline`
                list of items describing if a subject can be tested
                by a research group at a location belonging to the research
                group itself
            `,
        }),
        
        canBeTestedExternally: ExtBoolPermissionList({
            description: inline`
                list of items describing if a subject can be tested
                by an away team belonging to a research group, i.e.
                testing the subject at a non-institute location
            `,
        }),

        disabledForTestingIntervals: {
            type: 'array',
            default: [],
            items: DateTimeInterval(),
            description: inline`
                list of items describing if the subject should not be
                tested in a certain date-time period, for example
                when a human subject is on holidays or something or 
                an animal is ill and one wants to wait for recovery
            `,
        },

    },
    required: [
        'canBeTestedInhouse',
        'canBeTestedByAwayTeam',
        'disabledForTestingIntervals'
    ]
    
});

module.exports = testingPermissionsSchema;
