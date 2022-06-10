'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');

var {
    SimpleHandler,
    checkForeignIdsExist,
    removeReservationsInInterval, // FIXME: where to put this?
} = require('../../../lib/');

var {
    verifyNoConflictingLocationExperiments
} = require('@mpieva/psydb-api-message-handler-lib');

var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'reservation/remove-inhouse-slot',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    var canRemove = permissions.hasSomeLabOperationFlags({
        types: ['inhouse', 'online-video-call'],
        flags: ['canWriteReservations']
    });
    if (!canRemove) {
        throw new ApiError(403);
    }

    var {
        studyId,
        experimentOperatorTeamId,
        locationId,
        interval,
    } = message.payload.props;

    // TODO: use FK to check existance (?)
    await checkForeignIdsExist(db, {
        'study': studyId,
        'experimentOperatorTeam': experimentOperatorTeamId,
        'location': locationId
    });

    await verifyNoConflictingLocationExperiments({
        db, locationId, interval
    });
}

handler.triggerSystemEvents = async (context) => {
    var { message } = context;
    var { id, props } = message.payload;

    var { 
        interval: removeInterval,
        locationId,
        experimentOperatorTeamId
    } = props;

    await removeReservationsInInterval({
        ...context,
        removeInterval,
        extraFilters: {
            'state.locationId': locationId,
            'state.experimentOperatorTeamId': experimentOperatorTeamId
        }
    })

}

module.exports = handler;
