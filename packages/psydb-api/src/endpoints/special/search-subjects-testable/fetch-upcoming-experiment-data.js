'use strict';
var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

var fetchUpcomingExperimentData = async ({
    db,
    locationIds,
    subjectIds,
    after,
}) => {
    if (locationIds && subjectIds) {
        throw new Error(
            'cannot use both subjectIds and locationIds combined'
        );
    }
    var upcomingExperiments = await (
        db.collection('experiment').aggregate([
            ...(subjectIds ? [{ $unwind: '$state.subjectData' }] : []),
            { $match: {
                ...( locationIds && {
                    'state.locationId': { $in: locationIds },
                }),
                ...( subjectIds && {
                    'state.subjectData.subjectId': { $in: subjectIds }
                }),
                'state.interval.start': { $gt: after },
            }},
            { $sort: { 'state.interval.start': 1 }},
            { $project: {
                'state.studyId': true,
                'state.interval.start': true,
                ...( subjectIds && {
                    'state.subjectData.subjectId': true,
                }),
            }},
            { $group: {
                ...( locationIds && {
                    _id: '$state.locationId',
                }),
                ...( subjectIds && {
                    _id: '$state.subjectData.subjectId',
                }),
                //next: { $first: '$$ROOT' }
                upcoming: { $push: '$$ROOT' }
            }},
            { $project: {
                'upcoming.state.subjectData': false,
            }},
        ]).toArray()
    );
    console.dir(upcomingExperiments, { depth: null });
    
    var experimentRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experiment',
        records: upcomingExperiments.reduce((acc, it) => ([
            ...acc, ...it.upcoming
        ]), [])
    });

    return {
        upcomingForIds: upcomingExperiments,
        ...experimentRelated
    }
}

module.exports = fetchUpcomingExperimentData;
