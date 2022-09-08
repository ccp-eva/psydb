'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError, createId } = require('@mpieva/psydb-api-lib');
var SimpleHandler = require('../../../lib/simple-handler');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/auto-process-subjects',
    createSchema,
});


handler.checkAllowedAndPlausible = async (handlerContext) => {
    var { db, permissions, message, cache } = handlerContext;
    var { experimentId } = message.payload;

    var experiment = await db.collection('experiment').findOne({
        _id: experimentId
    });

    if (!experiment) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    if (experiment.type !== 'away-team') {
        throw new ApiError(400, 'InvalidExperimentType');
    }

    var isAllowed = permissions.hasLabOperationFlag(
        'away-team', 'canPostprocessExperiments'
    );
    if (!isAllowed) {
        throw new ApiError(403);
    }

    cache.experiment = experiment;
}

handler.triggerSystemEvents = async (handlerContext) => {
    var { db, message, cache, dispatch } = handlerContext;
    var { participationStatus } = message.payload;
    var { experiment } = cache;

    var study = await (
        db.collection('study').findOne({ _id: experiment.state.studyId })
    );
    var opsTeam = await (
        db.collection('experimentOperatorTeam')
        .findOne({ _id: experiment.state.experimentOperatorTeamId })
    );

    var todos = (
        experiment.state.subjectData
        .map((it, ix) => ({ ...it, index: ix }))
        .filter(it => it.participationStatus === 'unknown')
    );

    console.log(todos);

    var experimentUpdate = { $set: {
        ...todos.reduce((acc, it) => {
            var path = `state.subjectData.${it.index}.participationStatus`;
            return { ...acc, [path]: participationStatus }
        }, {}),
        'state.isPostprocessed': true
    }};

   console.log(experimentUpdate);

    dispatch({
        collection: 'experiment',
        channelId: experiment._id,
        payload: experimentUpdate
    });

    for (var it of todos) {
        var { subjectId } = it;
        await dispatchSubjectUpdate({
            dispatch,

            experiment,
            opsTeam,
            study,
            subjectId,
            participationStatus,
        });
    }
}

var dispatchSubjectUpdate = async (bag) => {
    var { 
        dispatch,
        experiment, opsTeam, study, subjectId, participationStatus
    } = bag;

    var { _id: experimentId, type, state } = experiment;
    var {
        studyId,
        locationId,
        locationRecordType,
        interval,
    } = state;

    var path = 'scientific.state.internals.participatedInStudies';
    var subjectUpdate = { $push: {
        [path]: {
            _id: await createId(),

            type,
            experimentId,
            
            studyId,
            studyType: study.type,
            locationId,
            locationType: locationRecordType,
            experimentOperatorIds: opsTeam.state.personnelIds,

            timestamp: interval.start,
            status: participationStatus,

            excludeFromMoreExperimentsInStudy: false
        }
    }};

    //console.log(subjectUpdate);

    await dispatch({
        collection: 'subject',

        channelId: subjectId,
        subChannelKey: 'scientific',
        payload: subjectUpdate
    });
}

module.exports = handler;
