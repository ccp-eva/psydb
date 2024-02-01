'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { nanoid } = require('nanoid');
var { without } = require('@mpieva/psydb-core-utils');
var { Ajv, ApiError, compareIds } = require('@mpieva/psydb-api-lib');
var { SimpleHandler, checkForeignIdsExist } = require('../../../lib');

var BaseSchema = require('./base-schema');
var DefaultSchema = require('./default-schema');
var OnlineSurveySchema = require('./online-survey-schema');
var ApestudiesWKPRCDefaultSchema = require('./apestudies-wkprc-default-schema');

var createFakeExperiment = require('./create-fake-experiment');
var createParticipation = require('./create-participation');

var handler = {};

handler.shouldRun = (message) => (
    message.type === 'subject/add-manual-participation'
)

handler.checkSchema = async ({ db, message }) => {
    var ajv = Ajv();
    var isValid = undefined;

    isValid = ajv.validate(BaseSchema(), message);
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
    else if (labProcedureType === 'apestudies-wkprc-default') {
        isValid = ajv.validate(ApestudiesWKPRCDefaultSchema(), message);
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
    // TODO
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        labProcedureType,
        subjectIds,
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

    var subjects = await (
        db.collection('subject')
        .find({ _id: { $in: subjectIds }})
        .toArray()
    );
    // TODO: check subject permissions agains study permissions
    // TODO: check subject record type agains study subject types
    if (subjects.length !== subjectIds.length) {
        throw new ApiError(409, 'SubjectNotFound');
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

    if (labProcedureType === 'apestudies-wkprc-default') {
        var {
            studyTopicIds,
        } = message.payload;

        var studyTopics = await (
            db.collection('studyTopic').find({
                _id: { $in: studyTopicIds }
            }).toArray()
        );
        if (studyTopics.length !== studyTopicIds.length) {
            throw new ApiError(409, 'StudyTopicNotFound');
        }

        cache.studyTopics = studyTopics;
    }

    cache.study = study;
    cache.subjects = subjects;
}

handler.triggerSystemEvents = async (context) => {
    var { message, cache } = context;
    var {
        labProcedureType,
        subjectsAreTestedTogether = false
    } = message.payload;

    if (subjectsAreTestedTogether) {
        var bag = _createBag(context);
        
        var experimentId = await createFakeExperiment(context, bag);
        await createParticipation(context, { ...bag, experimentId });
    }
    else {
        var { subjects } = cache;
        for (var it of subjects) {
            var bag = _createBag(context);
            bag.subjects = [ it ];

            var experimentId = await createFakeExperiment(context, bag);
            await createParticipation(context, { ...bag, experimentId });
        }
    }
}

handler.triggerOtherSideEffects = async () => {};

const _createBag = (context) => {
    var {
        message,
        cache,
    } = context;

    var { payload } = message;
    var {
        labProcedureType,
        subjectsAretestedTogether = false,

        timestamp,
        status = 'participated',
        
        experimentOperatorIds,
        excludeFromMoreExperimentsInStudy,

        // apestudies
        experimentName,
    } = payload;

    var {
        study,
        subjects,
        location,
        experimentOperatorTeam,
        
        // apestudies
        studyTopics,
    } = cache;

    var bag = {
        labProcedureType,
        timestamp,
        status,
        
        study,
        subjects,
        location,

        // apestudies
        studyTopics,
        experimentName,

        experimentOperatorTeam,
        experimentOperatorIds,
        excludeFromMoreExperimentsInStudy,
    };

    return bag;
}
module.exports = handler;
