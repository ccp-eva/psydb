'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var {
    checkIntervalHasReservation,
    checkConflictingSubjectExperiments,
    dispatchCreateEvents,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/create-from-inhouse-reservation',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
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
        //subjectGroupIds,
        subjectIds,
    } = message.payload.props;

    // TODO: use FK to check existance (?)
    await checkForeignIdsExist(db, {
        //'subjectGroup': subjectGroupIds,
        'subject': subjectIds,
        'study': [ studyId ],
        'experimentOperatorTeam': [ experimentOperatorTeamId ],
        'location': [ locationId ]
    });

    await checkIntervalHasReservation({
        db, interval, locationId, experimentOperatorTeamId
    });

    await checkConflictingSubjectExperiments({
        db, subjectIds, interval
    });
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { id, props } = payload;

    //var { reservation } = cache;
    var locationRecord = await db.collection('location').findOne({
        _id: props.locationId,
    }, { projection: { type: true }});

    await dispatchCreateEvents({
        db,
        rohrpost,
        personnelId,

        forcedExperimentId: id,

        type: 'inhouse',
        //reservationId: reservation._id,
        seriesId: nanoid(), // FIXME: id format
        studyId: props.studyId,
        experimentOperatorTeamId: props.experimentOperatorTeamId,
        locationId: props.locationId,
        locationRecordType: locationRecord.type,
        interval: props.interval,

        //subjectGroupIds: props.subjectGroupIds,
        subjectIds: props.subjectIds,

        //lastKnownReservationEventId: props.lastKnownReservationEventId,
    });
}

module.exports = handler;
