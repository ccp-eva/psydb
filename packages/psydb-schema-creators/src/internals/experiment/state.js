'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    Id,
    ForeignId,
    DateTimeInterval,
    ParticipationStatus,
    InvitationStatus,
} = require('@mpieva/psydb-schema-fields');

// TODO: merge adjascent reservations into one? or have a handler?
var ExperimentState = ({
    enableInternalProps
} = {}) => {
    var schema = ExactObject({
        properties: {
            seriesId: Id({
                description: inline`
                    used when this experiment belongs to a series
                    of experiments
                `,
            }), // foreign id w/ custom handler??

            reservationId: ForeignId({
                collection: 'reservation',
            }),
            
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

            // this enableds us to trakc which subject group was selected
            // in case the subject belongs to multiple groups
            // TODO: decide if subject can belong to multiple groups
            // probably should since children/people get older
            // also group relation is might be time based i guess
            selectedSubjectGroupIds: {
                type: 'array',
                default: [],
                items: ForeignId({
                    collection: 'subjectGroup'
                })
            },
            selectedSubjectIds: {
                type: 'array',
                default: [],
                items: ForeignId({
                    collection: 'subject'
                })
            },

            subjectData: {
                type: 'array',
                default: [],
                items: ExactObject({
                    properties: {
                        subjectId: ForeignId({
                            collection: 'subject',
                        }),
                        invitatonStatus: InvitationStatus(),
                        participationStatus: ParticipationStatus(),
                        // TODO: file refs?
                    },
                    required: [
                        'studyId',
                        'invitationStatus',
                        'participationStatus',
                    ]
                })
            }
        },
        required: [
            'seriesId',
            'reservationId',
            'studyId',
            'experimentOperatorTeamId',
            'locationId',
            'interval',
            'selectedSubjectGroupIds',
            'selectedSubjectIds',
            'subjectData',
        ]
    })

    return schema;
}

module.exports = ExperimentState;

