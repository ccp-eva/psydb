'use strict';
var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

// FIXME: this needs renaming as it includes
// experiments that havent been postprocessed by are in the past
var fetchPastLocationStudyData = async ({
    db,
    locationIds,
    before,
}) => {
    var pastExperiments = await (
        db.collection('experiment').aggregate([
            { $match: {
                'state.locationId': { $in: locationIds },
                $or: [
                    { 'state.interval.start': { $lte: before }},
                    //{ 'state.isPostprocessed': false }
                ],
            }},
            { $sort: { 'state.interval.start': 1 }},
            { $project: {
                _id: true,
                type: true,
                'state.locationId': true,
                'state.studyId': true,
                'state.interval.start': true,
            }},
            { $group: {
                _id: '$state.locationId',
                past: { $push: '$$ROOT' }
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
        records: pastExperiments.reduce((acc, it) => ([
            ...acc, ...it.past
        ]), [])
    });



    return {
        upcomingForIds: upcomingExperiments,
        ...experimentRelated
    }
}

module.exports = fetchUpcomingExperimentData;
