'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var { ApiError } = require('@mpieva/psydb-api-lib');

var {
    prepareExperimentRecord,
    prepareSubjectRecord,
    prepareOpsTeamRecord,
    prepareLocationRecord,

    verifySubjectMovable,
} = require('../util');

var checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        cache,
        message
    } = context

    var isAllowed = permissions.hasLabOperationFlag(
        'online-video-call', 'canMoveAndCancelExperiments'
    );
    if (!isAllowed) {
        throw new ApiError(403);
    }

    var targetCache = cache.targetCache = {};

    var {
        experimentId,
        subjectId,
        target
    } = message.payload;

    await prepareExperimentRecord(context, {
        experimentType: 'online-video-call',
        experimentId,
    });
   
    await prepareSubjectRecord(context, {
        subjectId,
    });

    var { experimentRecord } = cache;
    var { studyId } = experimentRecord.state;

    var targetContext = {
        db,
        cache: targetCache,
    };
    if (target.experimentId) {
        await prepareExperimentRecord(targetContext, {
            experimentType: 'online-video-call',
            experimentId: target.experimentId,
        });

        /*await verifySubjectMovable(context, {
            subjectId,
            sourceExperimentRecord: experimentRecord,
            targetExperimentRecord: targetCache.experimentRecord
        });*/
    }
    else {
        await prepareLocationRecord(targetContext, {
            locationId: target.locationId,
        });
        await prepareOpsTeamRecord(targetContext, {
            opsTeamId: target.experimentOperatorTeamId,
            studyId,
        });

        /*await verifySubjectMovable(context, {
            subjectId,
            sourceExperimentRecord: experimentRecord,
            targetReservationData: {
                locationRecord: targetCache.locationRecord,
                opsTeamRecord: targetCache.opsTeamRecord,
                interval: target.interval
            }
        });*/
    }
}

module.exports = checkAllowedAndPlausible;
