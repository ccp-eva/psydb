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
    });
}

module.exports = Schema;
