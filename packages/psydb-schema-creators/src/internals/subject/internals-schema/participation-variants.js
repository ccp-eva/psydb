'use strict';
var {
    ClosedObject,
    StringConst,
    ForeignId,
    DateTime,
    ParticipationStatus,
} = require('@mpieva/psydb-schema-fields');

// FIXME: participation contains more fields now
var ManualParticipation = () => ClosedObject({
    'type': StringConst({ value: 'manual' }),
    'studyId': ForeignId({ collection: 'study' }),
    'locationId': ForeignId({ collection: 'location' }),
    'timestamp': DateTime(),
    'status': ParticipationStatus(),
});

var OnlineParticipation = () => ClosedObject({
    'type': StringConst({ value: 'online' }),
    'studyId': ForeignId({ collection: 'study' }),
    'timestamp': DateTime(),
    'status': ParticipationStatus(),
});

var ExperimentParticipation = ({ type }) => ClosedObject({
    'type': StringConst({ value: type }),
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
