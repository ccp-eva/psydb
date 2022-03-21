'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler, checkForeignIdsExist } = require('../../../lib');

var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'experiment/create-followup-awayteam',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        message
    } = context;

    var isAllowed = permissions.hasLabOperationFlag(
        'away-team', 'canMoveAndCancelExperiment'
    );
    if (!isAllowed) {
        throw new ApiError(403);
    }

    var {
        sourceExperimentId,
        targetInterval,
        subjectOp,
    } = message.payload;

    var sourceExperiment = await db.collection('experiment').findOne({
        _id: sourceExperimentId,
        type: 'away-team',
    });
    if (!sourceExperiment) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    var {
        locationId,
        experimentOperatorTeam,
        subjectData,
    } = sourceExperiment.state;

    var subjectDataForOp = [];
    var shouldRemoveFromSource = false;
    switch (subjectOp) {
        case 'copy':
            subjectDataForOp = subjectData;
            break;
        case 'move-unprocessed':
            subjectDataForOp = subjectData.filter(it => (
                it.participationStatus === 'unknown'
            ));
            shouldRemoveFromSource = true;
            break;
        case 'none':
        default:
            subjectDataForOp = [];
            break;
    }

    await checkIntervalHasReservation({
        db,
        interval: targetInterval,
        experimentOperatorTeamId,
    });
    
    await checkConflicingSubjectExperiments({
        db,
        interval: targetInterval,
        subjectIds: subjectDataForOp.map(it => it.subjectId)
    });

    await checkConflictingLocationExperiments({
        db,
        interval: targetInterval,
        locationId,
    });

    cache.sourceExperiment = sourceExperiment;
    cache.subjectDataForOp = subjectDataForOp;
    cache.targetInterval = targetInterval;
    cache.shouldRemoveFromSource = shouldRemoveFromSource;
}

handler.triggerSystemEvents = async (context) => {
    var { cache } = context;
    var { shouldRemoveFromSource } = cache;

    var targetExperimentId = await createTargetExperiment(context);
    if (subjectDataForOp.length > 0 && shouldRemoveFromSource) {
        await removeSubjectsFromSource(context);
    }
}

var createTargetExperiment = async (context) => {
    var { cache, dispatchProps } = context;
    var { sourceExperiment, subjectDataForOp, targetInterval } = cache;

    var targetExperimentId = createId('experiment');
    var props = {
        ...sourceExperiment.state,
        selectedSubjectIds: subjectDataForOp.map(it => it._id),
        subjectData: subjectDataForOp.map(it => ({
            ...it,
            // FIXME: we might need to pass autoConfirm here for inhouse
            invitationStatus: 'scheduled'
        })),
        interval: targetInterval,
        isCanceled: false,
        isPostprocessed: false,
    }

    await dispatchProps({
        collection: 'experiment',
        channelId: targetExperimentId,
        isNew: true,
        additionalChannelProps: {
            type: sourceExperiment.type
        },

        initialize: true,
        recordType: sourceExperiment.type
    });

    return targetExperimentId;
}

var removeSubjectsFromSource = async (context) => {
    var 
}

module.exports = handler;
