'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    ForeignId,
    DateTime,
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
        timestamp: DateTime()
    },
    require: [
        'type',
        'studyId',
        'timestamp',
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
        timestamp: DateTime()
    },
    require: [
        'type',
        'studyId',
        'experimentId',
        'timestamp',
    ]
});

var internalsSchema = ExactObject({
    properties: {
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
    },
    required: [
        'participatedInStudies',
    ],
});

module.exports = internalsSchema;
