'use strict';
var debug = require('debug')('psydb:api:message-handlers');

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
    messageType: 'experiment/move-sibject-inhouse',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message
}) => {
    var targetCache = cache.targetCache = {};

    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        experimentId,
        subjectId,
        target
    } = message.payload;

    var experimentRecord = cache.experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId
        })
    );

    if (!experimentRecord) {
        throw new ApiError(400, 'InvalidExperimentId');
    }
    if (experimentRecord.state.isCanceled) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    var subjectRecord = cache.subjectRecord = await (
        db.collection('subject').findOne({
            _id: subjectId
        })
    );
    if (!subjectRecord) {
        throw new ApiError(400, 'InvalidSubjectId');
    }

    if (target.experimentId) {
        
        var targetExperimentRecord = targetCache.experimentRecord = await (
            db.collection('experiment').findOne({
                _id: target.experimentId
            })
        );

        if (!targetExperimentRecord) {
            throw new ApiError(400, 'InvalidTargetExperimentId');
        }
        if (targetExperimentRecord.state.isCanceled) {
            throw new ApiError(400, 'InvalidTargetExperimentId');
        }

        var subjectExistsInTarget = (
            targetExperimentRecord.state.subjectData.find(it => (
                compareIds(it.subjectId, subjectId)
            ))
        )
        if (subjectExistsInTarget) {
            throw new ApiError(400, 'SubjectExistsInTarget');
        }
    }
    else {

        var targetLocationRecord = targetCache.locationRecord = await (
            db.collection('location').findOne({
                _id: locationId
            })
        );
        if (!targetLocationRecord) {
            throw new ApiError(400, 'InvalidTargetLocationId');
        }

        var targetTeamRecord = targetCache.teamRecord = await (
            db.collection('experimentOperatorTeam').findOne({
                _id: locationId
            })
        );
        if (!targetTeamRecord) {
            throw new ApiError(400, 'InvalidTargetTeamId');
        }

        await checkIntervalHasReservation({
            db, interval, locationId, experimentOperatorTeamId
        });

        await checkConflictingSubjectExperiments({
            db, subjectIds, interval
        });
    }
};

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var { experimentId, subjectId, target } = payload;

    var {
        experimentRecord,
        subjectRecord,
        targetCache
    } = cache;

    if (target.experimentId) {
        dispatchRemoveSubjectEvents({
            experimentRecord,
            subjectRecord,
        });
        dispatchAddSubjectEvents({
            experimentRecord: targetCache.experimentRecord,
            subjectRecord,
        });
    }
    else {
        
    }

