'use strict';
var {
    fetchRelatedLabelsForMany
} = require('@mpieva/psydb-api-lib');


// FIXME: this needs renaming as it includes
// experiments that havent been postprocessed by are in the past
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
    
    await db.collection('experiment').ensureIndex({
        'type': 1,
        'state.locationId': 1,
        //'state.subjectData.subjectId': 1,
        'state.isPostprocessed': 1,
        'state.interval.start': 1,
        'state.interval.end': 1,
    }, {
        name: 'upcomingExpIndex'
    });

    var upcomingExperiments = await (
        db.collection('experiment').aggregate([
            { $match: {
                ...( locationIds && {
                    'state.locationId': { $in: locationIds },
                }),
                //...( subjectIds && {
                //    'state.subjectData.subjectId': { $in: subjectIds }
                //}),
                $or: [
                    { 'state.interval.start': { $gt: after }},
                    { 'state.isPostprocessed': false }
                ],
            }},
            { $sort: { 'state.interval.start': 1 }},
            ...(subjectIds ? [
                { $unwind: '$state.subjectData' },
                { $match: {
                    'state.subjectData.subjectId': { $in: subjectIds }
                }}
            ] : []),
            { $project: {
                _id: true,
                type: true,
                'state.locationId': true,
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
                'upcoming.state.locationId': false,
            }},
        ]).toArray()
    );
    
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
