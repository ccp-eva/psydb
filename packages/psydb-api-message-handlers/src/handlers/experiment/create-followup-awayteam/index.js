'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    mongoEscapeDeep,
    createId
} = require('@mpieva/psydb-api-lib');

var { SimpleHandler, checkForeignIdsExist } = require('../../../lib');

var {
    checkIntervalHasReservation,
    checkConflictingSubjectExperiments,
    checkConflictingLocationExperiments,
} = require('../util');

var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'experiment/create-followup-awayteam',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        cache,
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
        experimentOperatorTeamId,
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
    
    await checkConflictingSubjectExperiments({
        db,
        interval: targetInterval,
        subjectIds: subjectDataForOp.map(it => it.subjectId)
    });

    await checkConflictingLocationExperiments({
        db,
        interval: targetInterval,
        locationId,
    });

    cache.type = sourceExperiment.type;
    cache.sourceExperiment = sourceExperiment;
    cache.subjectDataForOp = subjectDataForOp;
    cache.targetInterval = targetInterval;
    cache.shouldRemoveFromSource = shouldRemoveFromSource;
}

handler.triggerSystemEvents = async (context) => {
    var { cache } = context;
    var { subjectDataForOp, shouldRemoveFromSource } = cache;

    var targetExperimentId = await createTargetExperiment(context);
    if (subjectDataForOp.length > 0) {
        await pushExperimentToSubjects({ ...context, targetExperimentId });

        if (shouldRemoveFromSource) {
            await removeSubjectsFromSource(context);
            await pullExperimentFromSubjects(context);
        }
    }
}

var createTargetExperiment = async (context) => {
    var { cache, dispatchProps } = context;
    var { sourceExperiment, subjectDataForOp, targetInterval } = cache;

    var targetExperimentId = await createId('experiment');
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
    };

    await dispatchProps({
        collection: 'experiment',
        channelId: targetExperimentId,
        isNew: true,
        additionalChannelProps: {
            type: sourceExperiment.type
        },
        props,

        initialize: true,
        recordType: sourceExperiment.type
    });

    return targetExperimentId;
}

var removeSubjectsFromSource = async (context) => {
    var { cache, dispatch } = context;
    var { sourceExperiment, subjectDataForOp } = cache;

    var subjectIds = subjectDataForOp.map(it => it._id);
    await dispatch({
        collection: 'experiment',
        channelId: sourceExperiment._id,
        payload: { $pull: {
            'state.selectedSubjectIds': { $in: subjectIds },
            'state.subjectData': { subjectId: { $in: subjectIds }}
        }}
    });
}

var pushExperimentToSubjects = async (context) => {
    var { cache, rohrpost, personnelId } = context;
    var { type, targetExperimentId, subjectDataForOp } = cache;

    var now = new Date();
    var subjectIds = subjectDataForOp.map(it => it._id);

    if (['inhouse', 'online-video-call'].includes(type)) {
        var update = { $push: {
            'scientific.state.internals.invitedForExperiments': {
                type: 'away-team',
                studyId,
                experimentId,
                timestamp: now,
                status: 'scheduled',
            }
        }};

        await rohrpost._experimental_dispatchMultiplexed({
            collection: 'subject',
            channelIds: subjectIds,
            subChannelKey: 'scientific',
            messages: [ { personnelId, payload: mongoEscapeDeep(update) }],
            mongoExtraUpdate: {
                ...update,
                $set: {
                    'scientific._rohrpostMetadata.unprocessedEventIds': []
                }
            }
        });
    }
}

var pullExperimentFromSubjects = async (context) => {
    var { cache, rohrpost, personnelId } = context;
    var { sourceExperiment, subjectDataForOp } = cache;

    var experimentId = sourceExperiment._id;
    var subjectIds = subjectDataForOp.map(it => it._id);

    var update = { $pull: {
        'scientific.state.internals.invitedForExperiments': { experimentId },
        'scientific.state.internals.participatedInStudies': { experimentId },
    }};

    await rohrpost._experimental_dispatchMultiplexed({
        collection: 'subject',
        channelIds: subjectIds,
        subChannelKey: 'scientific',
        messages: [ { personnelId, payload: mongoEscapeDeep(update) }],
        mongoExtraUpdate: {
            ...update,
            $set: {
                'scientific._rohrpostMetadata.unprocessedEventIds': []
            }
        }
    });
}

module.exports = handler;
