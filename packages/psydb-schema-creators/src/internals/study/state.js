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

// -> type A (has date of birth)
//      -> age interval 01
//              -> condition 01
//                      -> value 01
//                      -> value 02
//              -> condition 02
//                      -> value 02
//      -> age interval 02
//              -> condition 01
//                      -> value 01
// -> type B (has _no_ date of birth)
//      -> condition 01
//              -> value 01
//              -> value 02

// TODO: stub; needs conditions handling somehow
// also we need condition templates for study types
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
            }),
            shorthand: SaneString({
                title: 'Kürzel',
            }),
            scientistIds: ForeignIdList({
                collection: 'personnel',
            }),

            runningPeriod: DateOnlyServerSideInterval({
                title: 'Laufzeit',
                required: [ 'start', 'end' ],
                additionalStartKeywords: { title: 'Beginn' },
                additionalEndKeywords: { title: 'Ende', isNullable: true },
            }),

            studyTopicIds: ForeignIdList({
                collection: 'studyTopic',
                minLength: 1,
            }),

            // TODO: move to labProcedureSettings
            enableFollowUpExperiments: DefaultBool({
                title: 'Folge-Experimente anschalten'
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

            // TODO: excluded study ids
            excludedOtherStudyIds: ForeignIdList({
                title: 'Ausgeschlossene Studien',
                collection: 'study',
            }),

            // FIXME: should probably be in internals
            selectionSettingsBySubjectType: SubjectSelectionSettingsList({
                subjectRecordTypeRecords,
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
