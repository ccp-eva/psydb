'use strict';
var {
    fetchRelatedLabelsForMany
} = require('@mpieva/psydb-api-lib');


var fetchProcessedExperimentData = async ({
    db,
    locationIds,
}) => {
    
    await db.collection('experiment').ensureIndex({
        'state.interval.start': 1,
    });
    await db.collection('experiment').ensureIndex({
        'state.locationId': 1,
        'state.isPostprocessed': 1,
    }, { name: 'pastStudyLocationMatchIndex' });

    var processedExperiments = await (
        db.collection('experiment').aggregate([
            { $sort: { 'state.interval.start': -1 }},
            { $match: {
                'state.locationId': { $in: locationIds },
                'state.isPostprocessed': true
            }},
            { $project: {
                _id: true,
                'state.locationId': true,
                'state.studyId': true,
                'state.interval.start': true,
            }},
            { $group: {
                _id: {
                    locationId: '$state.locationId',
                    studyId: '$state.studyId',
                    timestamp: '$state.interval.start'
                },
                first: { $first: '$$ROOT' }
            }},
            { $replaceRoot: { newRoot: '$first' }},
            { $group: {
                _id: '$state.locationId',
                processed: { $push: '$$ROOT' }
            }},
        ]).toArray()
    );

    for (var it of processedExperiments) {
        it.processed = it.processed.sort((a, b) => (
            a.state.interval.start.getTime() < b.state.interval.start.getTime()
            ? 1 : -1
        )).slice(0, 3)
    }
    
    var experimentRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experiment',
        records: processedExperiments.reduce((acc, it) => ([
            ...acc, ...it.processed
        ]), [])
    });

    return {
        processedForIds: processedExperiments,
        ...experimentRelated
    }
}

module.exports = fetchProcessedExperimentData;
