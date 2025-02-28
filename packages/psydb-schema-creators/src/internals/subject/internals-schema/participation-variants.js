'use strict';
var {
    ClosedObject,
    ForeignId,
    DateTime,
    ParticipationStatus,
} = require('@mpieva/psydb-schema-fields');

// FIXME: participation contains more fields now
var ManualParticipation = () => ClosedObject({
    'type': {
        type: 'string',
        const: 'manual',
        default: 'manual'
    },
    'studyId': ForeignId({ collection: 'study' }),
    'locationId': ForeignId({ collection: 'location' }),
    'timestamp': DateTime(),
    'status': ParticipationStatus(),
});

var OnlineParticipation = () => ClosedObject({
    'type': {
        type: 'string',
        const: 'online',
    },
    'studyId': ForeignId({ collection: 'study' }),
    'timestamp': DateTime(),
    'status': ParticipationStatus(),
});

var ExperimentParticipation = ({ type }) => ClosedObject({
    'type': {
        type: 'string',
        const: type,
        default: type,
    },
    'studyId': ForeignId({ collection: 'study' }),
    'experimentId': ForeignId({ collection: 'experiment' }),
    'locationId': ForeignId({ collection: 'location' }),
    'timestamp': DateTime(),
    'status': ParticipationStatus(),
});

module.exports = {
    ManualParticipation,
    OnlineParticipation,
    ExperimentParticipation
}
