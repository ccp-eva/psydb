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
        subjectId: ForeignId({
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
                experimentOperatorTeamId: ForeignId({
                    collection: 'experimentOperatorTeam'
                }),
                experimentOperatorIds: ForeignIdList({
                    collection: 'experimentOperatorIds',
                    minItems: 1,
                })
            },
            required: [
                ...requiredKeys,
            ],
            oneOf: [
                { required: [ 'experimentOperatorTeamId' ]},
                { required: [ 'experimentOperatorIds' ]},
            ]
        }),
    });
}

module.exports = Schema;
