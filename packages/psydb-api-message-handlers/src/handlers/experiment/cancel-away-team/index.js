'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError, mongoEscapeDeep } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib');
var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'experiment/cancel-away-team',
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
        experimentId,
    } = message.payload;

    var experiment = await db.collection('experiment').findOne({
        _id: experimentId,
        type: 'away-team',
    });
    if (!experiment) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    var { subjectData } = experiment.state;
    var processedSubjectIds = subjectData.reduce((acc, it) => {
        return (
            it.participationStatus !== 'unknown'
            ? [ ...acc, it.subjectId ]
            : acc
        )
    }, []);

    if (processedSubjectIds.length > 0) {
        throw new ApiError(409, {
            apiStatus: 'ExperimentHasProcessedSubjects',
            data: { subjectIds: processedSubjectIds }
        })
    }

    cache.experimentId = experimentId;
    cache.subjectIds = subjectData.map(it => it.subjectId);
}

handler.triggerSystemEvents = async (context) => {
    await pullExperimentFromSubjects(context);
    await removeExperiment(context);
}

var pullExperimentFromSubjects = async (context) => {
    var { cache, rohrpost, personnelId } = context;
    var { experimentId, subjectIds } = cache;

    // FIXME: throw here and check outside?
    if (subjectIds.length < 1) {
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

var removeExperiment = async (context) => {
    var { db, cache } = context;
    var { experimentId } = cache;

    await db.collection('experiment').removeOne({
        _id: experimentId
    });
}

module.exports = handler;
