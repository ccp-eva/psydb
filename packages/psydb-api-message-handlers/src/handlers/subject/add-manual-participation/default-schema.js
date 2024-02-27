'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var {
    ExactObject,
    OpenObject,
    Id,
    EventId,
    ForeignId,
    ForeignIdList,
    IdentifierString,
    DateTime,
    ParticipationStatus,
    StringEnum,
    CustomRecordTypeKey,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var OneOf = ({ variants, ...keywords }) => ({
    type: 'object',
    oneOf: variants
});

var AllOf = ({ variants, keywords }) => ({
    type: 'object',
    allOf: variants
});

var Schema = () => {
    // TODO: this variant breaks when unmarshalling
    // as it tries to apply date format on second branch when
    // the value is already a date
    var requiredProps = {
        labProcedureType: StringEnum(
            enums.experimentVariants.keys
        ),
        subjectIds: ForeignIdList({
            collection: 'subject',
        }),
        studyId: ForeignId({
            collection: 'study',
        }),
        locationId: ForeignId({
            collection: 'location'
        }),
        timestamp: DateTime(),
        status: ParticipationStatus(),
        excludeFromMoreExperimentsInStudy: DefaultBool(),
    };
    var requiredKeys = Object.keys(requiredProps);


    // TODO: this variant breaks when unmarshalling
    // as it tries to apply date format on second branch when
    // the value is already a date
    /*
    return Message({
        type: `subject/add-manual-participation`,
        payload: OneOf({ variants: [
            ExactObject({
                properties: {
                    ...requiredProps,
                    experimentOperatorTeamId: ForeignId({
                        collection: 'experimentOperatorTeam'
                    })
                },
                required: [
                    ...requiredKeys,
                    'experimentOperatorTeamId'
                ]
            }),
            ExactObject({
                properties: {
                    ...requiredProps,
                    experimentOperatorIds: ForeignIdList({
                        collection: 'experimentOperatorIds'
                    })
                },
                required: [
                    ...requiredKeys,
                    'experimentOperatorIds'
                ]
            }),
        ]})
    });*/
    
    return Message({
        type: `subject/add-manual-participation`,
        payload: OpenObject({
            properties: {
                ...requiredProps,
            },
            required: [
                ...requiredKeys,
            ],
            oneOf: [
                { 
                    properties: { experimentOperatorTeamId: ForeignId({
                        collection: 'experimentOperatorTeam'
                    })},
                    required: [ 'experimentOperatorTeamId' ],
                    propertyNames: { not: { enum: [
                        'experimentOperatorIds'
                    ]}}
                },
                {
                    properties: { experimentOperatorIds: ForeignIdList({
                        collection: 'experimentOperatorIds',
                        // TODO: migration mode
                        //minItems: 1,
                    })},
                    required: [ 'experimentOperatorIds' ],
                    propertyNames: { not: { enum: [
                        'experimentOperatorTeamId'
                    ]}}
                },
            ]
        }),
    });
}

module.exports = Schema;
