'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { 
    ApiError,
    FakeAjvError,
    createId
} = require('@mpieva/psydb-api-lib');

var SimpleHandler = require('../../../lib/simple-handler');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/change-study',
    createSchema,
});


handler.checkAllowedAndPlausible = async (handlerContext) => {
    var { db, permissions, message, cache } = handlerContext;
    var { experimentId, studyId, labTeamId } = message.payload;

    var experiment = await db.collection('experiment').findOne({
        _id: experimentId
    });
    if (!experiment) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    var { type, realType } = experiment;
    type = realType || type;

    // NOTE: root can do that
    var isAllowed = permissions.hasLabOperationFlag(
        type, 'canChangeExperimentStudy'
    );
    if (!isAllowed) {
        throw new ApiError(403);
    }

    var study = await db.collection('study').findOne({
        _id: studyId,
    });
    
    if (!study) {
        throw new ApiError(400, 'InvalidStudyId');
    }

    var validExperimentVariants = await (
        db.collection('experimentVariant').find({
            studyId, type,
        }).toArray()
    );
    if (validExperimentVariants.length < 1) {
        throw new ApiError(400, {
            apiStatus: 'InvalidMessageSchema',
            data: { ajvErrors: [
                FakeAjvError({
                    dataPath: '/payload/studyId',
                    errorClass: 'ImplausibleStudyId',
                    message: 'Studie erlaubt keine Termine dieser Art'
                })
            ]}
        })
    }
}

handler.triggerSystemEvents = async (handlerContext) => {
    var { db, message, cache, dispatch } = handlerContext;
    var { experimentId, studyId, labTeamId } = message.payload;

    var experimentUpdate = { $set: {
        'state.studyId': studyId,
        'state.experimentOperatorTeamId': labTeamId
    }};

   console.log(experimentUpdate);

    dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: experimentUpdate
    });
}

module.exports = handler;
