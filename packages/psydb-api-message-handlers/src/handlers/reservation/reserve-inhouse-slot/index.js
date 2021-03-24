'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler'),
    PutMaker = require('../../../lib/put-maker'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var {
    checkConflictingTeamReservations,
    checkConflictingLocationReservations,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'reservation/reserve-inhouse-slot',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
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

    await checkConflictingTeamReservations({
        db, experimentOperatorTeamId, interval
    });
    
    await checkConflictingLocationReservations({
        db, locationId, interval
    });
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, props } = payload;

    var channel = (
        rohrpost
        .openCollection('reservation')
        .openChannel({
            id,
            isNew: true,
            additionalChannelProps: {
                type: 'inhouse'
            }
        })
    );
    
    var messages = PutMaker({ personnelId }).all({
        '/state/seriesId': nanoid(),
        '/state/isDeleted': false,
        '/state/studyId': props.studyId,
        '/state/experimentOperatorTeamId': props.experimentOperatorTeamId,
        '/state/locationId': props.locationId,
        '/state/interval/start': props.interval.start,
        '/state/interval/end': props.interval.end,
    });

    await channel.dispatchMany({ messages });
}

module.exports = handler;
