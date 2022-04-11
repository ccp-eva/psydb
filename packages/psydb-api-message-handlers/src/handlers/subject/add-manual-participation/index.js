'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { nanoid } = require('nanoid');
var { without } = require('@mpieva/psydb-core-utils');
var { ApiError, compareIds } = require('@mpieva/psydb-api-lib');
var { SimpleHandler, checkForeignIdsExist } = require('../../../lib');

var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'subject/add-manual-participation',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    // TODO
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        subjectId,
        studyId,
        locationId,

        experimentOperatorTeamId,
        experimentOperatorIds,
    } = message.payload;

    var study = await db.collection('study').findOne({ _id: studyId });
    // TODO: check study permissions
    if (!study) {
        throw new ApiError(409, 'StudyNotFound');
    }

    var subject = await db.collection('subject').findOne({ _id: subjectId });
    // TODO: check subject permissions agains study permissions
    // TODO: check subject record type agains study subject types
    if (!subject) {
        throw new ApiError(409, 'SubjectNotFound');
    }
    
    var location = await (
        db.collection('location').findOne({ _id: locationId })
    );
    if (!location) {
        throw new ApiError(409, 'LocationNotFound');
    }

    if (experimentOperatorTeamId) {
        var opsTeam = await (
            db.collection('experimentOperatorTeam')
            .findOne({ _id: experimentOperatorTeamId })
        );
        if (!opsTeam) {
            throw new ApiError(409, 'ExperimentOperatorTeamNotFound');
        }
        cache.experimentOperatorTeam = experimentOperatorTeam;
    }
    else {
        var experimentOperators = await (
            db.collection('personnel')
            .find({ _id: { $in: experimentOperatorIds } })
            .toArray()
        );
        if (experimentOperators.length !== experimentOperatorIds.length) {
            throw new ApiError(409, {
                apiStatus: 'ExperimentOperatorNotFound',
                data: without(
                    experimentOperatorIds,
                    experimentOperators.map(it => it._id)
                )
            });
        }
    }

    cache.study = study;
    cache.subject = subject;
    cache.location = location;
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
    cache,

    dispatch,
}) => {
    var { type: messageType, payload } = message;
    var {
        labProcedureType,
        studyId,
        subjectId,
        locationId,

        timestamp,
        status,
        
        experimentOperatorTeamId,
        experimentOperatorIds,
    } = payload;

    var { study, subject, location } = cache;

    var participationItem = {
        _id: nanoid(),

        type: 'manual',
        realType: labProcedureType,

        studyId,
        studyType: study.type,
        locationId,
        locationType: location.type,

        timestamp,
        status,
    }

    if (experimentOperatorTeamId) {
        var { experimentOperatorTeam } = cache;
        var { personnelIds, color } = experimentOperatorTeamId.state;
        
        participationItem = {
            ...participationItem,
            experimentOperatorTeamId,
            experimentOperatorTeamColor: color,
            experimentOperatorIds: personnelIds
        }
    }
    else {
        participationItem = {
            ...participationItem,
            experimentOperatorIds,
        }
    }

    await dispatch({
        collection: 'subject',
        channelId: subjectId,
        subChannelKey: 'scientific',
        payload: { $push: {
            'scientific.state.internals.participatedInStudies': (
                participationItem
            ),
        }}
    });
}

module.exports = handler;
