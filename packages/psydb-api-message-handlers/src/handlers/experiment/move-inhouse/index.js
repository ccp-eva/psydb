'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    unique
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    compareIds,
    checkForeignIdExists,
} = require('@mpieva/psydb-api-lib');

var {
    SimpleHandler,
    PutMaker,
    PushMaker
} = require('../../../lib');

var {
    checkIntervalHasReservation,
    checkConflictingSubjectExperiments,
    prepareExperimentRecord,
    prepareOpsTeamRecord,
    prepareTargetLocation,
    dispatchAllChannelMessages,
} = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/move-inhouse',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        cache,
        message
    } = context;

    // TODO
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        experimentId,
        experimentOperatorTeamId,
        locationId,
        interval,
    } = message.payload;

    await prepareExperimentRecord(context, {
        experimentType: 'inhouse',
        experimentId,
    });

    var { experimentRecord } = cache;
    var { studyId } = experimentRecord.state;

    await prepareOpsTeamRecord(context, {
        studyId,
        opsTeamId: experimentOperatorTeamId
    });

    await prepareTargetLocation(context, {
        studyId,
        experimentType: 'inhouse',
        locationId,
    });
    
    await checkIntervalHasReservation({
        db,
        interval,
        locationId,
        experimentOperatorTeamId: (
            //experimentRecord.state.experimentOperatorTeamId
            experimentOperatorTeamId
        )
    });

    // FIXME: i think this be done but only when the interval is outside of
    // the original
    /*await checkConflictingSubjectExperiments({
        db,
        interval,
        subjectIds: experimentOperatorTeam.stat.selectedSubjectIds,
    });*/
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
    personnelId,
}) => {
    var { type: messageType, payload } = message;
    var {
        experimentId,
        experimentOperatorTeamId,
        loactionId,
        interval,
    } = payload;

    var {
        experimentRecord,
        locationRecord,
    } = cache;

    var experimentChannel = (
        rohrpost.openCollection('experiment').openChannel({
            id: experimentId
        })
    )

    // FIXME: not sure about lastknownEventId
    await experimentChannel.dispatchMany({
        lastKnownEventId: experimentRecord.events[0]._id,
        messages: [
            ...PutMaker({ personnelId }).all({
                '/state/experimentOperatorTeamId': experimentOperatorTeamId,
                '/state/locationRecordType': locationRecord.type,
                '/state/locationId': locationRecord._id,
                '/state/interval': interval,
            })
        ]
    })

}

module.exports = handler;
