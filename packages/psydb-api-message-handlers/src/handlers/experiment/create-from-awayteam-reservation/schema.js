'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    SaneString,
    DateTimeInterval,
    FullText,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/create-from-awayteam-reservation`,
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

                        subjectIds: {
                            type: 'array',
                            default: [],
                            items: ForeignId({
                                collection: 'subject',
                            }),
                        },

                        comment: FullText(),

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
                        'subjectIds',
                        'comment',
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
