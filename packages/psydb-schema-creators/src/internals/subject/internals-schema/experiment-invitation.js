'use strict';
var {
    ClosedObject,
    StringConst,
    ForeignId,
    DateTime,
    InvitationStatus,
} = require('@mpieva/psydb-schema-fields');

var ExperimentInvitation = ({ type }) => ClosedObject({
    'type': StringConst({ value: type }),
    'studyId': ForeignId({ collection: 'study' }),
    'experimentId': ForeignId({ collection: 'experiment' }),
    'timestamp': DateTime(),
    'status': InvitationStatus(),
})

module.exports = ExperimentInvitation;
