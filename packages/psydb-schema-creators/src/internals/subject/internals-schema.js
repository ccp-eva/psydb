'use strict';
var { nanoid } = require('nanoid');
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    ForeignId,
    DateTime,
    ParticipationStatus,
    InvitationStatus,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

// FIXME: participation contains more fields now
var ManualParticipation = () => ExactObject({
    properties: {
        type: {
            type: 'string',
            const: 'manual',
            default: 'manual'
        },
        studyId: ForeignId({
            collection: 'study',
        }),
        locationId: ForeignId({
            collection: 'location',
        }),
        timestamp: DateTime(),
        status: ParticipationStatus(),
    },
    require: [
        'type',
        'studyId',
        'locationId',
        'timestamp',
        'status'
    ]
});

var OnlineParticipation = () => ExactObject({
    properties: {
        type: {
            type: 'string',
            const: 'online',
        },
        studyId: ForeignId({
            collection: 'study',
        }),
        timestamp: DateTime(),
        status: ParticipationStatus(),
    },
    require: [
        'type',
        'studyId',
        'timestamp',
        'status',
    ]
});

var ExperimentParticipation = ({ type }) => ExactObject({
    properties: {
        type: {
            type: 'string',
            const: type,
            default: type,
        },
        studyId: ForeignId({
            collection: 'study',
        }),
        experimentId: ForeignId({
            collection: 'experiment',
        }),
        locationId: ForeignId({
            collection: 'location',
        }),
        timestamp: DateTime(),
        status: ParticipationStatus(),
    },
    require: [
        'type',
        'studyId',
        'locationId',
        'experimentId',
        'timestamp',
        'status',
    ]
});

var ExperimentInvitation = ({ type }) => ExactObject({
    properties: {
        type: {
            type: 'string',
            const: type,
            default: type,
        },
        studyId: ForeignId({
            collection: 'study',
        }),
        experimentId: ForeignId({
            collection: 'experiment',
        }),
        timestamp: DateTime(),
        status: InvitationStatus(),
    },
    required: [
        'type',
        'studyId',
        'experimentId',
        'timestamp',
        'status',
    ]
})

var InternalsSchema = () => {
    return (
        ExactObject({
            properties: {
                isRemoved: DefaultBool(),
                // FIXME: this should actually be scheduledForExperiments
                // since it probably inludes away team based testing as well
                // im not sure about that though (online has to be handled
                // differently i guess cuz that are too many)
                invitedForExperiments: {
                    type: 'array',
                    default: [],
                    items: {
                        type: 'object',
                        lazyResolveProp: 'type',
                        oneOf: [
                            ExperimentInvitation({ type: 'inhouse' }),
                            // TODO: should that be stored?
                            ExperimentInvitation({ type: 'away-team' }),
                        ],
                    }
                },
                participatedInStudies: {
                    type: 'array',
                    default: [],
                    items: {
                        type: 'object',
                        lazyResolveProp: 'type',
                        oneOf: [
                            ManualParticipation(),
                            OnlineParticipation(),
                            ExperimentParticipation({ type: 'inhouse' }),
                            ExperimentParticipation({ type: 'away-team' }),
                        ]
                    }
                },
            },
            required: [
                'isRemoved',
                'invitedForExperiments',
                'participatedInStudies',
            ],
        })
    )
}

module.exports = InternalsSchema;
