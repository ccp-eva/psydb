'use strict';
var { nanoid } = require('nanoid');
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    ForeignId,
    DateTime,
    ParticipationStatus,
    InvitationStatus,
} = require('@mpieva/psydb-schema-fields');

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
        timestamp: DateTime(),
        status: ParticipationStatus(),
    },
    require: [
        'type',
        'studyId',
        'timestamp',
        'status'
    ]
});

var ExperimentParticipation = () => ExactObject({
    properties: {
        type: {
            type: 'string',
            const: 'experiment',
            default: 'experiment'
        },
        studyId: ForeignId({
            collection: 'study',
        }),
        experimentId: ForeignId({
            collection: 'experiment',
        }),
        timestamp: DateTime(),
        status: ParticipationStatus(),
    },
    require: [
        'type',
        'studyId',
        'experimentId',
        'timestamp',
        'status',
    ]
});

var ExperimentInvitation = () => ExactObject({
    properties: {
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
        'studyId',
        'experimentId',
        'timestamp',
        'status',
    ]
})

var InternalsSchema = () => {
    var onlineId = nanoid();
    return (
        ExactObject({
            properties: {
                invitedForExperiments: {
                    type: 'array',
                    default: [],
                    items: ExperimentInvitation(),
                },
                participatedInStudies: {
                    type: 'array',
                    default: [],
                    items: {
                        type: 'object',
                        lazyResolveProp: 'type',
                        oneOf: [
                            ManualParticipation(),
                            ExperimentParticipation(),
                        ]
                    }
                },
                onlineId: {
                    // FIXME: this needs to be nanoid specifically
                    type: 'string',
                    const: onlineId,
                    default: onlineId,
                }
            },
            required: [
                'invitedForExperiments',
                'participatedInStudies',
            ],
        })
    )
}

module.exports = InternalsSchema;
