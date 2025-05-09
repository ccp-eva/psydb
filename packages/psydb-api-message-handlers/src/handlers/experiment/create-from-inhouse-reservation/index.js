'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError, createId } = require('@mpieva/psydb-api-lib');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var {
    checkIntervalHasReservation,
    checkConflictingSubjectExperiments,
    checkConflictingLocationExperiments,
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

    dispatch,
    dispatchProps,
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

        dispatch,
        dispatchProps,

        forcedExperimentId: id,

        type: 'inhouse',
        seriesId: await createId(),
        studyId: props.studyId,
        experimentOperatorTeamId: props.experimentOperatorTeamId,
        locationId: props.locationId,
        locationRecordType: locationRecord.type,
        interval: props.interval,

        //subjectGroupIds: props.subjectGroupIds,
        subjectData: props.subjectData,
    });
}

module.exports = handler;
