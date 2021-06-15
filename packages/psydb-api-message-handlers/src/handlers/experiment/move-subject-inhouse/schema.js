'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    SaneString,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var OneOf = (variants) => ({
    type: 'object',
    oneOf: variants,
});

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/move-subject-inhouse`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                    recordType: 'inhouse',
                }),
                
                subjectId: ForeignId({
                    collection: 'subject',
                }),

                target: OneOf([
                    ExactObject({
                        properties: {
                            experimentId: ForeignId({
                                collection: 'experiment',
                                recordType: 'inhouse',
                            }),
                        },
                        required: [
                            'experimentId'
                        ]
                    }),
                    ExactObject({
                        properties: {
                            experimentOperatorTeamId: ForeignId({
                                collection: 'experimentOperatorTeam',
                            }),
                            locationId: ForeignId({
                                collection: 'location',
                            }),

                            interval: DateTimeInterval(),
                        },
                        required: [
                            'locationId',
                            'experimentOperatorTeamId',
                            'interval',
                        ]
                    })
                ])
            },
            required: [
                'experimentId',
                'subjectId',
                'target'
            ]
        })
    })
)

module.exports = createSchema;
