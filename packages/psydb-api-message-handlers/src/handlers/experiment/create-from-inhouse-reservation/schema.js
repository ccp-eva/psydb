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

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/create-from-inhouse-reservation`,
        payload: ExactObject({
            properties: {
                id: Id(),
                props: ExactObject({
                    properties: {
                        studyId: ForeignId({
                            collection: 'study',
                        }),
                        experimentOperatorTeamId: ForeignId({
                            collection: 'experimentOperatorTeam',
                        }),
                        locationId: ForeignId({
                            collection: 'location',
                        }),

                        interval: DateTimeInterval(),

                        subjectData: {
                            type: 'array',
                            default: [],
                            items: ExactObject({
                                properties: {
                                    subjectId: ForeignId({
                                        collection: 'subject',
                                    }),
                                    comment: FullText(),
                                    autoConfirm: DefaultBool(),
                                },
                                required: [ 'subjectId' ]
                            })
                        },

                        /*subjectGroupIds: {
                            type: 'array',
                            default: [],
                            items: ForeignId({
                                collection: 'subjectGroup',
                            }),
                        }*/
                    },
                    required: [
                        'studyId',
                        'locationId',
                        'experimentOperatorTeamId',
                        //'subjectGroupIds',
                        'subjectData',
                    ]
                })
            },
            required: [
                'props'
            ]
        })
    })
)

module.exports = createSchema;
