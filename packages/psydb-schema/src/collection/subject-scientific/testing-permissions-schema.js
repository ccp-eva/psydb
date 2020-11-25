'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ForeignId,
    DateTimeInterval,
    ExtBool,
} = require('@mpieva/psydb-schema-fields');

var ExtBoolPermissionList = ({ description } = {}) => ({
    type: 'array',
    default: [],
    items: {
        type: 'object',
        properties: {
            instituteId: ForeignId('institute'),
            permission: ExtBool(),
        },
        required: [
            'instituteId',
            'permission',
        ]
    }
});

var testingPermissionsSchema = {
    type: 'object',
    properties: {
        
        canBeTestedInhouse: ExtBoolPermissionList({
            description: inline`
                list of items describing if a subject can be tested
                by an institute at a location belonging to the insitute
                itself
            `,
        }),
        canBeTestedExternally: ExtBoolPermissionList({
            description: inline`
                list of items describing if a subject can be tested
                by an away team belonging to an institute, i.e.
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
    
};

module.exports = testingPermissionsSchema;
