'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    mongoEscapeDeep,
    createId
} = require('@mpieva/psydb-api-lib');

var { SimpleHandler, checkForeignIdsExist } = require('../../../lib');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: `experiment/followup-awayteam-move-to-placeholder`,
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
        'away-team', 'canMoveAndCancelExperiments'
    );
    if (!isAllowed) {
        throw new ApiError(403);
    }

    var {
        sourceExperimentId,
        targetExperimentId,
    } = message.payload;

    var sourceExperiment = await db.collection('experiment').findOne({
        _id: sourceExperimentId,
        type: 'away-team',
    });
    if (!sourceExperiment) {
        throw new ApiError(400, 'InvalidExperimentId');
    }
    
    var targetExperiment = await db.collection('experiment').findOne({
        _id: targetExperimentId,
        type: 'away-team',
    });
    if (!sourceExperiment) {
        throw new ApiError(400, 'InvalidExperimentId');
    }
    if (targetExperiment.state.subjectData.length > 0) {
        throw new ApiError(409, 'TargetNotPlaceHolderExperiment');
    }

    cache.type = targetExperiment.type;

    cache.sourceExperimentId = sourceExperimentId;
    cache.sourceExperiment = sourceExperiment;
    cache.targetExperimentId = targetExperimentId;
    cache.targetExperiment = targetExperiment;
}

handler.triggerSystemEvents = async (context) => {
    var { db, cache } = context;
    var { sourceExperiment } = cache;
    var { subjectData } = sourceExperiment.state;
    var study = await (
        db.collection('study')
        .findOne({ _id: sourceExperiment.state.studyId })
    );
    
    var movable = ['unknown', 'didnt-participate'];
    if (study.state.enableFollowUpExperiments) {
        movable.push('participated');
    }
    var subjectDataForOp = subjectData.filter(it => (
        movable.includes(it.participationStatus) &&
        !it.excludeFromMoreExperimentsInStudy
    ));

    var shouldCancelSource = (
        (
            subjectDataForOp
            .filter(it => !['participated'].includes(it.participationStatus))
            .length
        ) === subjectData.length
    );

    cache.subjectDataForOp = subjectDataForOp;


    if (subjectDataForOp.length > 0) {
        await addSubjectsToTarget(context);
        await pushExperimentToSubjects(context);

        await removeSubjectsFromSource(context);
        await pullExperimentFromSubjects(context);

        if (shouldCancelSource) {
            await removeSourceExperiment(context)
        }
    }
}

var addSubjectsToTarget = async (context) => {
    var { cache, dispatch } = context;
    var { targetExperimentId, subjectDataForOp } = cache;
    
    var experimentId = targetExperimentId;
    var subjectIds = subjectDataForOp.map(it => it.subjectId);

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $push: {
            'state.selectedSubjectIds': { $each: subjectIds },
            'state.subjectData': { $each: subjectDataForOp.map(it => ({
                ...it,
                // FIXME: we might need to pass autoConfirm here for inhouse
                invitationStatus: 'scheduled',
                participationStatus: 'unknown',
            }))},
        }}
    });
}

var removeSubjectsFromSource = async (context) => {
    var { cache, dispatch } = context;
    var { sourceExperimentId, subjectDataForOp } = cache;

    var experimentId = sourceExperimentId;
    var subjectIds = (
        subjectDataForOp
        .filter(it => !['participated'].includes(it.participationStatus))
        .map(it => it.subjectId)
    );
    if (!subjectIds.length) {
        return;
    }

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: {
            $pull: {
                'state.selectedSubjectIds': { $in: subjectIds },
                'state.subjectData': { subjectId: { $in: subjectIds }}
            },
            $set: {
                'state.isPostprocessed': true
            }
        }
    });
}

var pushExperimentToSubjects = async (context) => {
    var { cache, rohrpost, personnelId } = context;
    var { type, targetExperimentId, subjectDataForOp } = cache;

    var experimentId = targetExperimentId;
    var subjectIds = subjectDataForOp.map(it => it.subjectId);
    var now = new Date();

    if (['inhouse', 'online-video-call'].includes(type)) {
        var update = { $push: {
            'scientific.state.internals.invitedForExperiments': {
                type,
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
    var { sourceExperimentId, subjectDataForOp } = cache;

    var experimentId = sourceExperimentId;
    var subjectIds = (
        subjectDataForOp
        .filter(it => !['participated'].includes(it.participationStatus))
        .map(it => it.subjectId)
    );
    if (!subjectIds.length) {
        return;
    }

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
;
var removeSourceExperiment = async (context) => {
    var { db, cache } = context;
    var { sourceExperimentId } = cache;

    var experimentId = sourceExperimentId
    await db.collection('experiment').removeOne({
        _id: experimentId
    });
}

module.exports = handler;
