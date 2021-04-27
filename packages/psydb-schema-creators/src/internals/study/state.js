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
    DateTimeInterval,
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

var AgeFrameSettings = ({
    customFieldDefinitions
} = {}) => ExactObject({
    properties: {
        ageFrame: AgeFrame(),
        conditionList: DefaultArray({
            items: {
                // theese form an $and list
                oneOf: [
                    customFieldDefinitions.map(fieldDefinition => (
                        StudySearchCondition({ fieldDefinition })
                    ))
                ]
            }
        })
    },
    required: [
        'ageFrame',
        'conditionList',
    ]
});

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
                isCreateFinalized: DefaultBool(),
            }),

            name: SaneString(),
            shorthand: SaneString(),
            researchGroupIds: DefaultArray({
                minItems: 1,
                items: ForeignId({
                    collection: 'researchGroup'
                }),
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

            inhouseTestLocationSettings: DefaultArray({
                items: ExactObject({
                    properties: {
                        customRecordType: IdentifierString(),
                        // FIXME: maybe remove this
                        enableAllAvailableLocations: DefaultBool(),
                        // FIXME: ForeignIdLIst
                        enabledLocationIds: ForeignIdList({
                            collection: 'location',
                        })
                    },
                    required: [
                        'customRecordTypeId',
                        'enableAllAvailableLocations',
                        'enabledLocationIds',
                    ]
                })
            }),

            // TODO: excluded study ids
            excludedOtherStudyIds: ForeignIdList({
                collection: 'study',
            }),

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
