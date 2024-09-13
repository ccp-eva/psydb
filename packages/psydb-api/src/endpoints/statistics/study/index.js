'use strict';
var debug = require('debug')('psydb:api:endpoints:statistics:study');

var { only, keyBy, groupBy, unique } = require('@mpieva/psydb-core-utils');
var {
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateToArray,
    SmartArray,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');
var {
    MatchRunningPeriodOverlapStage,
    MatchAgeFrameOverlapStage
} = require('./db-helpers');

var endpoint = async (context, next) => {
    var { db, permissions, request } = context;
    
    var i18n = only({ from: context, keys: [
        'language', 'locale', 'timezone'
    ]});

    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }
    
    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var {
        runningPeriodOverlap,
        labMethodKeys,
        researchGroupId,
        scientistId,
        ageFrameIntervalOverlap
    } = request.body;

    var studies = await aggregateToArray({ db, study: SmartArray([
        ( researchGroupId && { $match: {
            'state.researchGroupIds': researchGroupId,
        }}),

        ( scientistId && { $match: {
            'state.scientistIds': scientistId,
        }}),
        
        ( runningPeriodOverlap && MatchRunningPeriodOverlapStage({
            interval: runningPeriodOverlap
        })),
    ])});

    // TODO
    var participationsForStudy = await fetchGroupedParticipations({
        db, studies
    });

    var ageFramesForStudy = await fetchGroupedAgeFrames({
        db, studies, filters: { ageFrameIntervalOverlap }
    });

    var labMethodsForStudy = await fetchGroupedLabMethods({
        db, studies, filters: { labMethodKeys }
    });

    var aggregateItems = [];
    for (var it of studies) {
        var { _id: studyId, type, state } = it;
        var { shorthand } = state;

        var ageFrames = ageFramesForStudy[studyId] || [];
        var labMethods = labMethodsForStudy[studyId] || [];

        if (labMethods.length > 0) {
            aggregateItems.push({
                _id: studyId,
                type,
                shorthand,
                ageFrames,
                labMethods: unique(labMethods)
            })
        }
    }

    context.body = ResponseBody({ data: {
        aggregateItems,
    }})

    await next();
}

var fetchGroupedParticipations = async (bag) => {
}


var sanitizeAgeFrameEdge = (ageFrameEdge) => {
    var { years, months, days } = ageFrameEdge;

    years = years || 0;
    months = months || 0;
    days = days || 0;

    return { years, months, days }
}

var fetchGroupedAgeFrames = async (bag) => {
    var { db, studies, filters } = bag;
    var { ageFrameIntervalOverlap = {}} = filters;
    var { start, end } = ageFrameIntervalOverlap;

    console.log({ start, end });

    if (start) {
        start = sanitizeAgeFrameEdge(start);
    }
    if (end) {
        end = sanitizeAgeFrameEdge(end);
    }

    var ageFrames = await aggregateToArray({ db, ageFrame: SmartArray([
        { $match: {
            studyId: { $in: studies.map(it => it._id) }
        }},
        ((start && end) && MatchAgeFrameOverlapStage({
            ageFrame: ageFrameIntervalOverlap
        }))
    ])});
    
    return groupBy({
        items: ageFrames, byProp: 'studyId',
        transform: (it) => it.state.interval
    });
}

var fetchGroupedLabMethods = async (bag) => {
    var { db, studies, filters } = bag;
    var { labMethodKeys = {}} = filters;
    var { logicGate, values = [] } = labMethodKeys;
    
    var groups = await aggregateToArray({
        db, experimentVariantSetting: SmartArray([
            { $match: {
                studyId: { $in: studies.map(it => it._id) }
            }},
            { $group: {
                _id: '$studyId',
                labMethods: { $push: '$type' }
            }},

            (( logicGate && values.length > 0) && { $match: {
                [`$${logicGate}`]: values.map(it => ({
                    'labMethods': it
                }))
            }})
        ])
    });

    return keyBy({
        items: groups, byProp: '_id',
        transform: (it) => it.labMethods
    });
}

module.exports = endpoint;
