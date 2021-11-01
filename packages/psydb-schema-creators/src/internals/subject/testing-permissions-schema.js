'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    DefaultArray,
    ForeignId,
    DateTimeInterval,
    ExtBool,
    ExperimentVariantEnum,
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
        
        canBeTestedInhouse: ExtBoolPermissionList({
            title: 'Interne Studie erlaubt für',
            description: inline`
                list of items describing if a subject can be tested
                by a research group at a location belonging to the research
                group itself
            `,
        }),
        
        canBeTestedByAwayTeam: ExtBoolPermissionList({
            title: 'Externe Studien erlaubt für',
            description: inline`
                list of items describing if a subject can be tested
                by an away team belonging to a research group, i.e.
                testing the subject at a non-institute location
            `,
        }),

        canBeTestedInOnlineVideoCall: ExtBoolPermissionList({
            title: 'Online-Video-Anruf erlaubt für',
            description: inline`
                list of items describing if a subject can be tested
                by a research group at a location belonging to the research
                group itself
            `,
        }),
        
        canBeTestedInOnlineSurvey: ExtBoolPermissionList({
            title: 'Online-Umfrage erlaubt für',
            description: inline`
                list of items describing if a subject can be tested
                by a research group at a location belonging to the research
                group itself
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

var RGPermissionItem = () => ExactObject({
    properties: {
        labProcedureTypeKey: ExperimentVariantEnum({ title: 'Für' }),
        value: ExtBool({ title: 'Erlaubnis'}),
    },
    required: [ 'labProcedureTypeKey', 'value' ]
});

var RGPermissions = () => ExactObject({
    properties: {
        researchGroupId: ForeignId({
            title: 'Forschungsgruppe',
            collection: 'researchGroup',
        }),
        permissionList: DefaultArray({
            title: 'Einstellungen',
            items: RGPermissionItem(),
            minItems: 1
        })
    },
    required: [ 'researchGroupId', 'permissionList' ],
})

var testingPermissionsSchema_NEW = DefaultArray({
    title: 'Teilnahme-Erlaubnis',
    items: RGPermissions(),
})

module.exports = testingPermissionsSchema_NEW;
