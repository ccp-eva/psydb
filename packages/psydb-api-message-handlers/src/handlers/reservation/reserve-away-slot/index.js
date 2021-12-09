'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler'),
    PutMaker = require('../../../lib/put-maker'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var {
    checkConflictingTeamReservations,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'reservation/reserve-awayteam-slot',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        studyId,
        experimentOperatorTeamId,
        interval,
    } = message.payload.props;

    // TODO: use FK to check existance (?)
    await checkForeignIdsExist(db, {
        //'study': [ a, b ],
        'study': studyId,
        'experimentOperatorTeam': experimentOperatorTeamId,
    });

    await checkConflictingTeamReservations({
        db, experimentOperatorTeamId, interval,
        types: [ 'awayTeam' ]
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
                type: 'awayTeam'
            }
        })
    );

    var messages = PutMaker({ personnelId }).all({
        '/state/seriesId': nanoid(),
        '/state/isDeleted': false,
        '/state/studyId': props.studyId,
        '/state/experimentOperatorTeamId': props.experimentOperatorTeamId,
        '/state/interval/start': props.interval.start,
        '/state/interval/end': props.interval.end,
    });

    await channel.dispatchMany({ messages });
}

module.exports = handler;
