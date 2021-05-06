'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    DefaultArray,
    ForeignId,
    DateTimeInterval,
    ExtBool,
} = require('@mpieva/psydb-schema-fields');

var ExtBoolPermissionList = ({
    ...additionalKeywords
} = {}) => (
    DefaultArray({
        systemType: 'ExtBoolPermissionList',
        items: ExactObject({
            properties: {
                researchGroupId: ForeignId({
                    title: 'Forschungsgruppe',
                    collection: 'researchGroup'
                }),
                permission: ExtBool({
                    title: 'Erlaubnis',
                }),
            },
            required: [
                'researchGroupId',
                'permission',
            ]
        }),
        ...additionalKeywords
    })
);

var testingPermissionsSchema = ExactObject({
    properties: {
        
        canBeTestedOnline: ExtBoolPermissionList({
            title: 'Online-Tests erlaubt für',
            description: inline`
                list of items describing if a subject can be tested
                by a research group at a location belonging to the research
                group itself
            `,
        }),
        
        canBeTestedInhouse: ExtBoolPermissionList({
            title: 'Testen In-House erlaubt für',
            description: inline`
                list of items describing if a subject can be tested
                by a research group at a location belonging to the research
                group itself
            `,
        }),
        
        canBeTestedByAwayTeam: ExtBoolPermissionList({
            title: 'Testen via Außen-Team erlaubt für',
            description: inline`
                list of items describing if a subject can be tested
                by an away team belonging to a research group, i.e.
                testing the subject at a non-institute location
            `,
        }),

        /*blockedFromTesting: DateTimeInterval({
            systemType: 'BlockedFromTesting',
            title: 'Gesperrt',
            // FIXME: thats a bit hacky,
            additionalStartKeywords: {
                title: 'Von',
                default: '1970-01-01T00:00:00.000Z'
            },
            additionalEndKeywords: {
                title: 'Bis',
                default: '1970-01-01T00:00:00.001Z'
            },
        })*/

    },
    required: [
        'canBeTestedInhouse',
        'canBeTestedByAwayTeam',
        //'blockedFromTesting'
    ]
    
});

module.exports = testingPermissionsSchema;
