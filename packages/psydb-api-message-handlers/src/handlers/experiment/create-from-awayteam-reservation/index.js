'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var {
    checkIntervalHasReservation,
    checkConflictingLocationReservations,
    checkConflictingSubjectExperiments,
    checkConflictingLocationExperiments,
    dispatchCreateEvents,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/create-from-awayteam-reservation',
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
        locationId,
        experimentOperatorTeamId,
        subjectIds,
        interval,
    } = message.payload.props;

    // TODO: use FK to check existance (?)
    await checkForeignIdsExist(db, {
        'study': [ studyId ],
        'experimentOperatorTeam': [ experimentOperatorTeamId ],
        'location': locationId,
        'subject': subjectIds
        //'subjectGroup': subjectGroupIds,
    });

    await checkIntervalHasReservation({
        db,
        interval,
        experimentOperatorTeamId,
    });

    await checkConflictingLocationReservations({
        db, locationId, interval
    });

    await checkConflictingSubjectExperiments({
        db, subjectIds, interval
    });
    
    await checkConflictingLocationExperiments({
        db, locationId, interval
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

    var locationRecord = await (
        db.collection('location').findOne({ _id: props.locationId })
    );

    await dispatchCreateEvents({
        db,
        rohrpost,
        personnelId,

        forcedExperimentId: id,

        type: 'away-team',
        seriesId: nanoid(), // FIXME: id format
        studyId: props.studyId,
        experimentOperatorTeamId: props.experimentOperatorTeamId,
        interval: props.interval,

        locationId: props.locationId,
        locationRecordType: locationRecord.type,
        //subjectGroupIds: props.subjectGroupIds,
        subjectData: props.subjectIds.map(subjectId => ({ subjectId })),
    });
}

module.exports = handler;
