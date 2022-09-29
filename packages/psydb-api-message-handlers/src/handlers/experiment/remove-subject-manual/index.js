'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { compareIds } = require('@mpieva/psydb-core-utils');

var { 
    ApiError,
    FakeAjvError,
    createId
} = require('@mpieva/psydb-api-lib');

var SimpleHandler = require('../../../lib/simple-handler');
var { dispatchRemoveSubjectEvents } = require('../util');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/remove-subject-manual',
    createSchema,
});


handler.checkAllowedAndPlausible = async (context) => {
    var { db, permissions, message, cache } = context;
    var { experimentId, subjectId } = message.payload;

    var isAllowed = permissions.hasLabOperationFlag(
        'away-team', 'canRemoveExperimentSubject'
    );
    if (!isAllowed) {
        throw new ApiError(403);
    }

    var experiment = await db.collection('experiment').findOne({
        _id: experimentId
    });
    if (!experiment) {
        throw new ApiError(400, 'InvalidExperimentId');
    }
    if (experiment.type !== 'away-team') {
        throw new ApiError(400, 'InvalidExperimentType');
    }

    var subject = await db.collection('subject').findOne({
        _id: subjectId
    });
    if (!subject) {
        throw new ApiError(400, 'InvalidSubjectId');
    }
    console.log(experiment.state);
    if (!experiment.state.selectedSubjectIds.find(it => compareIds(it, subjectId))) {
        throw new ApiError(400, 'InvalidSubjectId');
    }

    cache.experiment = experiment;
    cache.subject = subject;
}

handler.triggerSystemEvents = async (context) => {
    var { db, message, cache, dispatch } = context;
    var { experimentId, subjectId } = message.payload;
    var { experiment, subject } = cache;

    await dispatchRemoveSubjectEvents({
        ...context,

        experimentRecord: experiment,
        subjectRecord: subject,

        unparticipateStatus: 'deleted',
        blockSubjectFromTesting: false,

        dontTrackSubjectParticipatedInStudies: true,
    });
}

module.exports = handler;
