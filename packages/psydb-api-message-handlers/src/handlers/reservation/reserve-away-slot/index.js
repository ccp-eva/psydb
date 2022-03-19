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

    dispatchProps,
}) => {
    var { type: messageType, payload } = message;
    var { id, props } = payload;

    props.seriesId = nanoid();

    await dispatchProps({
        collection: 'reservation',
        channelId: id,
        isNew: true,
        additionalChannelProps: {
            type: 'awayTeam'
        },
        props,

        initialize: true,
        recordType: 'awayTeam',
    });
}

module.exports = handler;
