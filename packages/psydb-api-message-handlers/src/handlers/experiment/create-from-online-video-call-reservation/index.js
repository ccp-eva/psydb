'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var { ApiError, createId } = require('@mpieva/psydb-api-lib');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var {
    checkIntervalHasReservation,
    checkConflictingSubjectExperiments,
    dispatchCreateEvents,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/create-from-online-video-call-reservation',
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
        //throw new ApiError(403);
    }

    var {
        studyId,
        experimentOperatorTeamId,
        locationId,
        interval,
        //subjectGroupIds,
        subjectData,
    } = message.payload.props;

    var subjectIds = subjectData.map(it => it.subjectId);

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

handler.triggerSystemEvents = async (context) => {
    var {
        db,
        rohrpost,
        cache,
        message,
        personnelId,
    } = context;

    var { type: messageType, payload } = message;
    var { id, props } = payload;

    //var { reservation } = cache;
    var locationRecord = await db.collection('location').findOne({
        _id: props.locationId,
    }, { projection: { type: true }});

    await dispatchCreateEvents({
        ...context,

        forcedExperimentId: id,

        type: 'online-video-call',
        //reservationId: reservation._id,
        seriesId: await createId(),
        studyId: props.studyId,
        experimentOperatorTeamId: props.experimentOperatorTeamId,
        locationId: props.locationId,
        locationRecordType: locationRecord.type,
        interval: props.interval,

        //subjectGroupIds: props.subjectGroupIds,
        subjectData: props.subjectData,

        //lastKnownReservationEventId: props.lastKnownReservationEventId,
    });
}

module.exports = handler;
