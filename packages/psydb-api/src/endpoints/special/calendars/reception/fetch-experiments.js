'use strict';
var {
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    MatchIntervalOverlapStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchExperiments = async (context, options) => {
    var { db } = context;
    var { studyIds, start, end } = options;

    var records = await (
        db.collection('experiment').aggregate([
            MatchIntervalOverlapStage({ start, end }),
            { $match: {
                type: 'inhouse',
                'state.studyId': { $in: studyIds },
                'state.isCanceled': false,
            }},
            StripEventsStage(),
            { $sort: { 'state.interval.start': 1 }}
        ]).toArray()
    );
    
    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experiment',
        records,
    })

    return {
        records,
        related,
    }
}

module.exports = fetchExperiments;
