var {
    MatchIntervalOverlapStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchExperiments = (context) => {
    var { db } = context;

    var experimentRecords = await (
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
    
    return experimentRecords;
}

module.exports = fetchExperiments;
