'use strict';
var inline = require('@cdxoo/inline-text'),
    CustomProps = require('../../common/custom-props'),
    systemPermissionsSchema = require('../../common/system-permissions-schema');

 var {
     SubjectSelectionSettingsList
 } = require('@mpieva/psydb-schema-fields-special');

var {
    ExactObject,
    DefaultArray,
    DefaultBool,
    ForeignId,
    ForeignIdList,

    IdentifierString,
    SaneString,
    Color,
    DateOnlyServerSideInterval,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var StudyState = (ps = {}) => {
    var {
        customFieldDefinitions,
        subjectRecordTypeRecords,
        enableInternalProps,
    } = ps;

    var schema = ExactObject({
        properties: {
            
            ...(enableInternalProps && {
                // TODO: remove this property
                // we currently just keep it around to
                // not need to update the database
                isCreateFinalized: DefaultBool({ default: true}),
            }),

            name: SaneString({
                title: 'Bezeichnung',
                minLength: 1,
            }),
            shorthand: SaneString({
                title: 'Kürzel',
                minLength: 1,
            }),
            scientistIds: ForeignIdList({
                title: 'Wissenschaftler:innen',
                collection: 'personnel',
                minItems: 1,
            }),

            runningPeriod: DateOnlyServerSideInterval({
                title: 'Laufzeit',
                required: [ 'start', 'end' ],
                additionalStartKeywords: { title: 'Beginn' },
                additionalEndKeywords: { title: 'Ende', isNullable: true },
            }),

            studyTopicIds: ForeignIdList({
                title: 'Themengebiete',
                collection: 'studyTopic',
                minItems: 0,
            }),

            // TODO: move to labProcedureSettings
            enableFollowUpExperiments: DefaultBool({
                title: 'Proband:innen können mehrfach getestet werden'
            }),

            researchGroupIds: ForeignIdList({
                title: 'Forschungsgruppen',
                minItems: 1,
                collection: 'researchGroup',
                description: inline`
                    this list of ids will be used to get the permissions
                    for when we search in this studies context
                    for subjects or when checking foreign key field
                    permissions on the related collections records
                    i.e. it overrides the user role permission
                    in certain cases
                `,
            }),
            
            custom: CustomProps({ customFieldDefinitions }),
            systemPermissions: systemPermissionsSchema,
            
            // TODO: obsolete
            inhouseTestLocationSettings: DefaultArray({
                systemType: 'InhouseTestLocationSettings',
                items: ExactObject({
                    systemType: 'InhouseTestLocationSettingsItem',
                    title: 'Test-Locations',
                    properties: {
                        customRecordType: CustomRecordTypeKey({
                            title: 'Location-Typ',
                            collection: 'location',
                        }),
                        enabledLocationIds: ForeignIdList({
                            title: 'Zugewiesen',
                            collection: 'location',
                            // TODO: record type $data ??
                        })
                    },
                    required: [
                        'customRecordType',
                        'enabledLocationIds',
                    ]
                })
            }),

            // FIXME: should probably be in internals
            // TODO: obsolete
            selectionSettingsBySubjectType: { type: 'array' },
            /*selectionSettingsBySubjectType: SubjectSelectionSettingsList({
                subjectRecordTypeRecords,
            }),*/

            excludedOtherStudyIds: ForeignIdList({
                collection: 'study',
            }),

            ...(enableInternalProps && {
                interals: {
                    type: 'object',
                    properties: {
                        /*experimentOperatorTeamIds: {
                            type: 'array',
                            default: [],
                            items: ForeignId({
                                collection: 'experimentOperatorTeam'
                            }),
                        },*/

                        /*...(enableInternalProps && ({
                            isNew: { type: 'boolean', default: true },
                            isDirty: { type: 'boolean', default: true },
                        })),
                        nextSettings: StudySettings({
                            enableFlags: true,
                            enableInternalProps,
                        }),
                        settings: StudySettings({
                            enableInternalProps,
                        })*/
                    },
                    required: [
                        'excludedOtherStudyIds',
                        //'experimentOperatorTeamIds',
                        //'nextSettings',
                        //'settings',
                    ],
                },
            })
        },
        required: [
            'name',
            'shorthand',
            'runningPeriod',
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
