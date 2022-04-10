'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    SaneString,
    DateTimeInterval,
    FullText,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var OneOf = (variants) => ({
    type: 'object',
    oneOf: variants,
});

var createSchema = ({ messageType } = {}) => (
    Message({
        type: messageType,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                    recordType: 'online-video-call',
                }),
                
                subjectId: ForeignId({
                    collection: 'subject',
                }),
                comment: FullText(),
                autoConfirm: DefaultBool(),

                target: OneOf([
                    ExactObject({
                        properties: {
                            experimentId: ForeignId({
                                collection: 'experiment',
                                recordType: 'online-video-call',
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
