'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var nanoid = require('nanoid').nanoid;

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler'),
    checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var {
    checkIntervalHasReservation,
    checkConflictingSubjectExperiments,
    dispatchAllChannelMessages,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/remove-subject',
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
        experimentId,
        lastKnownExperimentEventId,
        subjectId,
        lastKnownSubjectEventId,

        unparticipateStatus,
        experimentComment,
        subjectComment,
        blockSubjectFromTestingUntil,
    } = message.payload.props;

    var experimentRecord = cache.experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId
        })
    );

    if (!experimentRecord) {
        throw new ApiError('InvalidExperimentId');
    }
    if (!compareIds(experimentRecord.events[0]._id, lastKnownExperimentEventId)) {
        throw new ApiError(400, 'ExperimentRecordHasChanged');
    }

    var {
        selectedSubjectIds,
        subjectData
    } = experimentRecord.state;

    var selectedSubjectIdsIndex = undefined;
    for (var [index, it] of selectedSubjectIds.entries()) {
        if (compareIds(it, subjectId)) {
            selectedSubjectIdsIndex = index;
        }
    }
    if (selectedSubjectIdsIndex === undefined) {
        throw new ApiError('InvalidSubjectId');
    }

    var subjectDataIndex = undefined;
    for (var [index, it] of selectedData.entries()) {
        if (
            compareIds(it.subjectId, subjectId)
            && it.participationStatus === 'unknown'
        ) {
            selectedSubjectIdsIndex = index;
        }
    }
    if (subjectDataIndex === undefined) {
        throw new ApiError('InvalidSubjectId');
    }

    var subjectRecord = cache.subjectRecord = await (
        db.collection('subject').findOne({
            _id: subjectId
        })
    );

    if (!subjectRecord) {
        throw new ApiError('InvalidSubjectId');
    }
    if (!compareIds(subjectRecord.events[0]._id, lastKnownSubjectEventId)) {
        throw new ApiError(400, 'SubjectRecordHasChanged');
    }

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

    await dispatchAllChannelMessages({
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
