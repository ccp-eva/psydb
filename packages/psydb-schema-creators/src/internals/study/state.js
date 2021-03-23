'use strict';
var inline = require('@cdxoo/inline-text'),
    CustomProps = require('../../common/custom-props'),
    systemPermissionsSchema = require('../../common/system-permissions-schema');

var {
    ExactObject,
    ForeignId,

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
        conditionList: {
            type: 'array',
            default: [],
            items: {
                // theese form an $and list
                oneOf: [
                    customFieldDefinitions.map(fieldDefinition => (
                        StudySearchCondition({ fieldDefinition })
                    ))
                ]
            }
        }
    },
    required: [
        'ageFrame',
        'conditionList',
    ]
});

var DoBTypeSettings = ({
    subjectType,
    customFieldDefinitions
} = {}) => ExactObject({
    properties: {
        subjectType: { const: subjectType },
        ageFrameSettingsList: {
            type: 'array',
            default: [],
            items: AgeFrameSettings({
                customFieldDefinitions
            })
        }
    },
    required: [
        'subjectType',
        'ageFrameSettingsList'
    ]
})

// TODO: stub; needs conditions handling somehow
// also we need condition templates for study types
var StudyState = ({
    customFieldDefinitions,
    customSubjectTypes,
    enableInternalProps,
} = {}) => {
    var schema = ExactObject({
        properties: {
            name: SaneString(),
            shorthand: SaneString(),
            researchGroupIds: {
                type: 'array',
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
            },
            
            externalLocationTypes: {
                type: 'array',
                items: IdentifierString(),
                // TODO: enum of location types that arent reservable
                // FIXME: not really possible to exclude some atm
                // custom types would need to have researchGroupIds
                // in their permissions ... not sure if they have atm
                // usableByResearchGroupIds
                description: inline`
                    list of location types arent reservable directly;
                    away teams can be send there to conduct experiments;
                    e.g. kindergardens, schools etc
                `
            },

            // FIXME: not sure if that is sufficient we maybe need to select the type first
            reservableLocationIds: {
                type: 'array',
                items: ForeignId({
                    collection: 'location',
                    custom: true,
                }),
                description: inline`
                    list of location ids; theese locations that are
                    directly reservable and will be used to conduct
                    experiments such as institute rooms
                ` 
            },

            custom: CustomProps({ customFieldDefinitions }),
            systemPermissions: systemPermissionsSchema,
            
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
