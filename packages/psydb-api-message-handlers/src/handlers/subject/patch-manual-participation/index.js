'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { nanoid } = require('nanoid');
var { without, compareIds } = require('@mpieva/psydb-core-utils');
var { Ajv, ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler, checkForeignIdsExist } = require('../../../lib');

var BaseSchema = require('./base-schema');
var DefaultSchema = require('./default-schema');
var OnlineSurveySchema = require('./online-survey-schema');

var setupParticipationItems = require('./setup-participation-items');
var updateParticipation = require('./update-participation');
var maybeUpdateRelatedParticipations = require('./maybe-update-related-participations');
var maybeUpdateExperiment = require('./maybe-update-experiment');

// XXX multiple schema checks + unmarshalling
var jsonify = (that) => JSON.parse(JSON.stringify(that))

var handler = {};

handler.shouldRun = (message) => (
    message.type === 'subject/patch-manual-participation'
)

handler.checkSchema = async ({ db, message }) => {
    var ajv = Ajv();
    var isValid = undefined;

    isValid = ajv.validate(BaseSchema(), jsonify(message));
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, {
            apiStatus: 'InvalidMessageSchema',
            data: { ajvErrors: ajv.errors }
        });
    }

    var { labProcedureType } = message.payload;
    if (labProcedureType === 'online-survey') {
        isValid = ajv.validate(OnlineSurveySchema(), message);
        if (!isValid) {
            throw new ApiError(400, {
                apiStatus: 'InvalidMessageSchema',
                data: { ajvErrors: ajv.errors }
            });
        }
    }
    else {
        isValid = ajv.validate(DefaultSchema(), message);
        if (!isValid) {
            throw new ApiError(400, {
                apiStatus: 'InvalidMessageSchema',
                data: { ajvErrors: ajv.errors }
            });
        }
    }
} 

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    if (!permissions.hasFlag('canWriteParticipation')) {
        throw new ApiError(403);
    }

    var {
        participationId,

        labProcedureType,
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

    var participatedSubject = await db.collection('subject').findOne({
        _id: subjectId,
        'scientific.state.internals.participatedInStudies._id': (
            participationId
        )
    });
    if (!participatedSubject) {
        throw new ApiError(409, 'SubjectParticipationMismatch');
    }
   
    if (labProcedureType !== 'online-survey') {
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
            cache.experimentOperatorTeam = opsTeam;
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
    
        cache.location = location;
    }

    cache.study = study;
    cache.subject = subject;
}

handler.triggerSystemEvents = async (context) => {
    var {
        db,
        rohrpost,
        message,
        personnelId,
        cache,

        dispatch,
    } = context;

    var { payload } = message;
    var { labProcedureType } = payload;
   
    setupParticipationItems(context);
    var { patchedItem, originalItem } = cache;

    if (patchedItem.type !== originalItem.type) {
        // var shouldThrow = await checkExperimentHasMultipleSubjects({
        //    experimentId
        // });
        // if (shouldThrow) {
        throw new ApiError(500, 'CantHandleTypeChange');
        // }
    }

    await updateParticipation(context);
   
    // TODO: decide if online survey should have an experiment or not
    // and what this would look like
    // no location, no experimenters, interval maybe (like a month or so)
    await maybeUpdateRelatedParticipations(context);
    await maybeUpdateExperiment(context);
    
}

handler.triggerOtherSideEffects = async () => {};

module.exports = handler;
