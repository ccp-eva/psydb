'use strict';
var debug = require('debug')('psydb:api:endpoints:statistics:study');

var { only, keyBy, groupBy, unique, ejson } = require('@mpieva/psydb-core-utils');
var {
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateToArray,
    SmartArray,
} = require('@mpieva/psydb-api-lib');

var { match } = require('@mpieva/psydb-mongo-stages');

var Schema = require('./schema');
var { MatchAgeFrameOverlapStage } = require('./db-helpers');

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
        payload: request.body,
        unmarshalClientTimezone: i18n.timezone
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
        
        ( runningPeriodOverlap && match.IntervalOverlapsOurs({
            dbpath: 'state.runningPeriod', interval: runningPeriodOverlap,
        })),
    ])});

    var ageFramesForStudy = await fetchGroupedAgeFrames({
        db, studies, filters: { ageFrameIntervalOverlap }
    });

    var labMethodsForStudy = await fetchGroupedLabMethods({
        db, studies, filters: { labMethodKeys }
    });

    var prefiltered = [];
    for (var it of studies) {
        var { _id: studyId, type, state } = it;
        var { shorthand } = state;

        var matchingAgeFrames = ageFramesForStudy[studyId] || [];
        var matchingLabMethods = labMethodsForStudy[studyId] || [];

        var shouldInclude = (
            matchingAgeFrames.length > 0
            && matchingLabMethods.length > 0
        );

        if (shouldInclude) {
            prefiltered.push({
                _id: studyId,
                type,
                shorthand,
                ageFrames: matchingAgeFrames,
                labMethods: unique(matchingLabMethods)
            })
        }
    }

    var participationCountsForStudy = await fetchGroupedParticipationCounts({
        db, studyIds: prefiltered.map(it => it._id),
        overlapInterval: runningPeriodOverlap,
    });

    var final = [];
    for (var it of prefiltered) {
        var { _id: studyId } = it;
        var participationCounts = participationCountsForStudy[studyId];

        if (participationCounts?.total > 0) {
            final.push({ ...it, participationCounts });
        }
    }

    context.body = ResponseBody({ data: {
        aggregateItems: final
    }})

    await next();
}

var fetchGroupedParticipationCounts = async (bag) => {
    var { db, studyIds, overlapInterval } = bag;
    
    var counts = await aggregateToArray({ db, experiment: SmartArray([
        { $match: {
            'state.studyId': { $in: studyIds },
            'state.subjectData.participationStatus': 'participated',
        }},
        ( overlapInterval && match.IntervalOverlapsOurs({
            dbpath: 'state.interval', interval: overlapInterval,
        })),

        { $unwind: '$state.subjectData' },
        { $match: {
            'state.subjectData.participationStatus': 'participated',
        }},
        { $group: {
            '_id': {
                studyId: '$state.studyId',
                type: { $ifNull: ['$realType', '$type'] }
            },
            'count': { $sum: 1 }
        }},
        { $group: {
            '_id': '$_id.studyId',
            'total': { $sum: '$count' },
            'byType': { $push: { 'k': '$_id.type', 'v': '$count' }}
        }},
        { $project: {
            'total': true,
            'byType': { $arrayToObject: '$byType' }
        }}
    ])});

    return keyBy({
        items: counts, byProp: '_id',
        transform: (it) => ({ total: it.total, ...it.byType })
    });
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
