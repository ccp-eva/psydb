'use strict';
var jsonpointer = require('jsonpointer');
var {
    fetchRelatedLabelsForMany,
    convertPathToPointer,
} = require('@mpieva/psydb-api-lib');


var fetchPastLocationStudyData = async ({
    db,
    locationIds,
    before,
}) => {
    
    var path = 'state.internals.participatedInStudies';
    var pastParticipation = await (
        db.collection('subject').aggregate([
            { $unwind: '$' + path },
            { $match: {
                [`${path}.locationId`]: { $in: locationId },
                [`${path}.timestamp`]: { $lte: before }
            }},
            { $sort: {
                [`${path}.timestamp`]: -1 }
            },
            { $limit: 3 },
            { $project: {
                [path]: true
            }}
        ]).toArray()
    );

    var pastParticipationRelated = await fetchRelatedLabelsForMany({
        collection: 'subject',
        records: pastParticipation
    });

    var pastExperiments = await (
        db.collection('experiment').aggregate([
            { $match: {
                'state.locationId': { $in: locationIds },
                'state.subjectData': { $size: { $gt: 0 }},
                $or: [
                    { 'state.interval.start': { $lte: before }},
                    //{ 'state.isPostprocessed': false }
                ],
            }},
            { $sort: { 'state.interval.start': -1 }},
            { $limit: 3 },
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
        pastForIds: pastParticipation.map(it => (
            jsonpointer.get(it, convertPathToPointer(path))
        )),
        related: pastParticipationRelated
    }
}

module.exports = fetchPastLocationStudyData;
