'use strict';
var {
    ClosedObject,
    ExactObject,
    ForeignId,
    DateTime,
    InvitationStatus,
} = require('@mpieva/psydb-schema-fields');

var ExperimentInvitation = ({ type }) => ClosedObject({
    'type': {
        type: 'string',
        const: type,
        default: type,
    },
    'studyId': ForeignId({ collection: 'study' }),
    'experimentId': ForeignId({ collection: 'experiment' }),
    'timestamp': DateTime(),
    'status': InvitationStatus(),
})

module.exports = ExperimentInvitation;
