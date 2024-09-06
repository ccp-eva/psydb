'use strict';
var debug = require('debug')('psydb:api:endpoints:statistics:study');

var { only, groupBy, unique } = require('@mpieva/psydb-core-utils');
var {
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateToArray,
    SmartArray,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');

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

        aggregateItems.push({
            _id: studyId,
            type,
            shorthand,
            ageFrames,
            labMethods: unique(labMethods)
        })
    }

    context.body = ResponseBody({ data: {
        aggregateItems,
    }})

    await next();
}

var fetchGroupedParticipations = async (bag) => {
}

var fetchGroupedAgeFrames = async (bag) => {
    var { db, studies, filters } = bag;

    var ageFrames = await aggregateToArray({ db, ageFrame: [
        { $match: {
            studyId: { $in: studies.map(it => it._id) }
        }}
    ]});
    
    return groupBy({
        items: ageFrames, byProp: 'studyId',
        transform: (it) => it.state.interval
    });
}

var fetchGroupedLabMethods = async (bag) => {
    var { db, studies, filters } = bag;
    
    var labMethods = await aggregateToArray({
        db, experimentVariantSetting: [
            { $match: {
                studyId: { $in: studies.map(it => it._id) }
            }}
        ]
    });

    return groupBy({
        items: labMethods, byProp: 'studyId',
        transform: (it) => it.type
    });
}

var MatchRunningPeriodOverlapStage = (bag) => {
    var { interval } = ps;
    var { start, end } = interval;
    var path = 'state.runningPeriod';

    return { $match: { $or: [
        IntervalIncludes({ path, value: start }),
        IntervalIncludes({ path, value: end }),
        IntervalWithinOurs({ path, interval})
    ]}}
}

var IntervalIncludes = ({ path, value }) => {
    return { $and: [
        { [`${path}.start`]: { $lte: value }},
        { [`${path}.end`]: { $gte: value }},
    ]}
}

var IntervalWithinOurs = ({ path, interval }) => {
    return { $and: [
        { [`${path}.start`]: { $gte: interval.start }},
        { [`${path}.end`]: { $lte: interval.end }},
    ]}
}

module.exports = endpoint;
