'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { nanoid } = require('nanoid');
var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler, checkForeignIdsExist } = require('../../../lib');

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
        //throw new ApiError(403);
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
        db, experimentOperatorTeamId, interval,
        types: [ 'inhouse' ]
    });
    
    await checkConflictingLocationReservations({
        db, locationId, interval,
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

    var locationRecord = await (
        db.collection('location').findOne({ _id: props.locationId })
    );

    props.seriesId = nanoid(); // FIXME: why?
    props.locationRecordType = locationRecord.type;

    await dispatchProps({
        collection: 'reservation',
        channelId: id,
        isNew: true,
        additionalChannelProps: {
            type: 'inhouse'
        },
        props,

        initialize: true,
        recordType: 'inhouse',
    });
}

module.exports = handler;
